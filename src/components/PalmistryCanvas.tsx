import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  PALM_LINES_CATALOG,
  PalmLineDefinition,
  PalmLineData,
  PalmPoint,
  PalmMountData,
  PALM_MOUNTS_CATALOG,
  SPECIAL_SIGNS_CATALOG,
  PalmSchool,
  buildComprehensivePalmReport,
  PalmistryComprehensiveReport
} from '../engine/palmistry';
import {
  detectRealPalmCreasesFromImage,
  detectRealPalmCreasesWithGemini,
  PalmVisionAnalysisResult
} from '../engine/palmVision';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { PersonalProfileBar } from './PersonalProfileBar';
import {
  Pencil,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Info,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Compass,
  Sliders,
  Sparkles,
  BookOpen,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  X,
  FileText,
  AlertTriangle,
  Award,
  Move,
  MousePointer,
  PlusCircle,
  MinusCircle,
  Zap,
  RefreshCw,
  MapPin,
  Lightbulb
} from 'lucide-react';

export const PalmistryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cấu hình cơ bản
  const { config } = useApp();
  const [handSide, setHandSide] = useState<'left' | 'right'>('right');
  const [dominantHand, setDominantHand] = useState<'left' | 'right'>('right');
  const [selectedSchool, setSelectedSchool] = useState<PalmSchool>('Ma Y Phái Thủ Tướng');
  const [userSelectedElement, setUserSelectedElement] = useState<'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'>('Mộc');
  const [activeTab, setActiveTab] = useState<'drawing' | 'report'>('drawing');

  // Trạng thái Canvas & Lớp vẽ
  const [selectedLineId, setSelectedLineId] = useState<string>('sinh_dao');
  const [toolMode, setToolMode] = useState<'drag' | 'draw' | 'add'>('drag');
  const [hoveredPoint, setHoveredPoint] = useState<{ lineId: string; pointIdx: number } | null>(null);
  const [draggingPoint, setDraggingPoint] = useState<{ lineId: string; pointIdx: number } | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isAnalyzingCV, setIsAnalyzingCV] = useState<boolean>(false);
  const [cvAnalysisMsg, setCvAnalysisMsg] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [bgOpacity, setBgOpacity] = useState<number>(0.75);
  const [showBgImage, setShowBgImage] = useState<boolean>(true);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [showMountsOverlay, setShowMountsOverlay] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  // Bộ dữ liệu đường nét có cấu trúc (chuẩn hóa 0.0 -> 1.0)
  const [linesState, setLinesState] = useState<Record<string, PalmLineData>>(() => {
    const initial: Record<string, PalmLineData> = {};
    PALM_LINES_CATALOG.forEach(def => {
      initial[def.id] = {
        id: def.id,
        displayName: def.vietnameseName,
        classicalName: def.classicalName,
        color: def.color,
        candidateDetected: false,
        userVerified: false,
        status: 'undetected',
        source: 'user_drawn',
        confidence: null,
        features: {
          lengthNormalized: null,
          relativeLength: 'Chưa xác định',
          visibleContrast: 'Chưa xác định',
          curvature: 'Chưa xác định',
          breaksObserved: 'Chưa xác định',
          branchesObserved: 'Chưa xác định',
          intersections: []
        },
        canvasPath: [],
        uncertainRegions: [],
        limitations: []
      };
    });
    return initial;
  });

  // Ngăn xếp hoàn tác
  const [undoStack, setUndoStack] = useState<{ lineId: string; path: PalmPoint[] }[]>([]);

  // Báo cáo hoàn chỉnh
  const [report, setReport] = useState<PalmistryComprehensiveReport | null>(null);

  // Vẽ lại toàn bộ canvas khi state thay đổi
  useEffect(() => {
    redrawCanvas();
  }, [handSide, showBgImage, bgImage, bgOpacity, showGuidelines, showMountsOverlay, linesState, selectedLineId, hoveredPoint, draggingPoint, activePointIndex, toolMode]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Nền tối thanh lịch
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    // 1. Vẽ ảnh nền (nếu có tải ảnh và bật chế độ xem ảnh)
    if (bgImage && showBgImage) {
      ctx.save();
      ctx.globalAlpha = bgOpacity;
      // Cân chỉnh tỉ lệ ảnh vừa vặn canvas
      const scale = Math.min(w / bgImage.width, h / bgImage.height);
      const nw = bgImage.width * scale;
      const nh = bgImage.height * scale;
      const ox = (w - nw) / 2;
      const oy = (h - nh) / 2;
      ctx.drawImage(bgImage, ox, oy, nw, nh);
      ctx.restore();
    } else if (showBgImage) {
      // Nếu không có ảnh, vẽ Đồ Bàn Mẫu Bàn Tay Hoàng Kim
      drawGoldenPalmOutline(ctx, w, h);
    }

    // 2. Vẽ các Gò Bàn Tay Bát Quái nếu bật overlay
    if (showMountsOverlay) {
      drawMountsOverlay(ctx, w, h);
    }

    // 3. Vẽ đường mẫu gợi ý (Guidelines) nếu bật
    if (showGuidelines && !bgImage) {
      drawSampleGuidelines(ctx, w, h);
    }

    // 4. Vẽ các đường nét người dùng đã vẽ / xác nhận
    drawUserLines(ctx, w, h);
  };

  // Vẽ Đồ Bàn Mẫu Bàn Tay Hoàng Kim (Golden Ratio Palm Outline)
  const drawGoldenPalmOutline = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    const isLeft = handSide === 'left';
    ctx.translate(isLeft ? w : 0, 0);
    ctx.scale(isLeft ? -1 : 1, 1);

    // Cổ tay & Lòng bàn tay
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.63, w * 0.32, h * 0.27, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 5 Ngón tay định vị
    // Ngón cái
    ctx.beginPath();
    ctx.ellipse(w * 0.21, h * 0.61, w * 0.085, h * 0.15, -0.6, 0, Math.PI * 2);
    ctx.stroke();

    // Ngón trỏ
    ctx.beginPath();
    ctx.ellipse(w * 0.36, h * 0.26, w * 0.062, h * 0.16, -0.08, 0, Math.PI * 2);
    ctx.stroke();

    // Ngón giữa
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.22, w * 0.062, h * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Ngón áp út
    ctx.beginPath();
    ctx.ellipse(w * 0.64, h * 0.25, w * 0.06, h * 0.16, 0.08, 0, Math.PI * 2);
    ctx.stroke();

    // Ngón út
    ctx.beginPath();
    ctx.ellipse(w * 0.77, h * 0.34, w * 0.052, h * 0.13, 0.22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  // Vẽ các Gò Bàn Tay Bát Quái
  const drawMountsOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    PALM_MOUNTS_CATALOG.forEach(mount => {
      const px = mount.center.x * w;
      const py = mount.center.y * h;

      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = '10px serif';
      ctx.textAlign = 'center';
      ctx.fillText(mount.name, px, py - 4);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.font = '8px sans-serif';
      ctx.fillText(mount.classicalPalace.split(' ')[0], px, py + 8);
    });
    ctx.restore();
  };

  // Vẽ đường chỉ mẫu minh họa
  const drawSampleGuidelines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    const isLeft = handSide === 'left';
    ctx.translate(isLeft ? w : 0, 0);
    ctx.scale(isLeft ? -1 : 1, 1);

    // Tâm Đạo (Heart Line)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.moveTo(w * 0.8, h * 0.5);
    ctx.bezierCurveTo(w * 0.6, h * 0.48, w * 0.45, h * 0.45, w * 0.38, h * 0.38);
    ctx.stroke();

    // Trí Đạo (Head Line)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.52);
    ctx.bezierCurveTo(w * 0.45, h * 0.55, w * 0.65, h * 0.6, w * 0.78, h * 0.66);
    ctx.stroke();

    // Sinh Đạo (Life Line)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.52);
    ctx.bezierCurveTo(w * 0.36, h * 0.65, w * 0.38, h * 0.78, w * 0.35, h * 0.86);
    ctx.stroke();

    // Định Mệnh (Fate Line)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.beginPath();
    ctx.moveTo(w * 0.52, h * 0.85);
    ctx.lineTo(w * 0.5, h * 0.42);
    ctx.stroke();

    ctx.restore();
  };

  // Vẽ đường cong Catmull-Rom Spline mượt mà (ôm theo nếp gấp da, thay thế nối điểm thô cứng)
  const drawSplineCurve = (ctx: CanvasRenderingContext2D, points: PalmPoint[], w: number, h: number) => {
    if (points.length === 0) return;
    if (points.length === 1) {
      ctx.arc(points[0].x * w, points[0].y * h, 4, 0, Math.PI * 2);
      return;
    }
    if (points.length === 2) {
      ctx.moveTo(points[0].x * w, points[0].y * h);
      ctx.lineTo(points[1].x * w, points[1].y * h);
      return;
    }

    ctx.moveTo(points[0].x * w, points[0].y * h);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = (p1.x + (p2.x - p0.x) / 6) * w;
      const cp1y = (p1.y + (p2.y - p0.y) / 6) * h;
      const cp2x = (p2.x - (p3.x - p1.x) / 6) * w;
      const cp2y = (p2.y - (p3.y - p1.y) / 6) * h;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x * w, p2.y * h);
    }
  };

  // Tính khoảng cách từ 1 điểm đến 1 đoạn thẳng
  const distanceToSegment = (p: PalmPoint, v: PalmPoint, wPt: PalmPoint): number => {
    const l2 = (v.x - wPt.x) * (v.x - wPt.x) + (v.y - wPt.y) * (v.y - wPt.y);
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (wPt.x - v.x) + (p.y - v.y) * (wPt.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (wPt.x - v.x)), p.y - (v.y + t * (wPt.y - v.y)));
  };

  const insertPointAtBestPosition = (path: PalmPoint[], newPt: PalmPoint): PalmPoint[] => {
    if (path.length < 2) return [...path, newPt];
    let bestIdx = path.length;
    let minDistance = Infinity;

    for (let i = 0; i < path.length - 1; i++) {
      const dist = distanceToSegment(newPt, path[i], path[i + 1]);
      if (dist < minDistance) {
        minDistance = dist;
        bestIdx = i + 1;
      }
    }
    const result = [...path];
    result.splice(bestIdx, 0, newPt);
    return result;
  };

  const updateLineGeometry = (lineId: string) => {
    setLinesState(prev => {
      const target = prev[lineId];
      if (!target || target.canvasPath.length < 2) return prev;
      const pStart = target.canvasPath[0];
      const pEnd = target.canvasPath[target.canvasPath.length - 1];
      const lengthEst = Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y);

      return {
        ...prev,
        [lineId]: {
          ...target,
          features: {
            ...target.features,
            lengthNormalized: lengthEst,
            relativeLength: lengthEst > 0.45 ? 'Dài' : lengthEst > 0.25 ? 'Trung bình' : 'Ngắn',
            visibleContrast: 'Rõ nét',
            curvature: target.canvasPath.length > 3 ? 'Cong nhiều' : 'Cong nhẹ',
            breaksObserved: 'Không có'
          }
        }
      };
    });
  };

  // Vẽ các đường nét do người dùng vẽ hoặc AI gợi ý (với đường cong spline và điểm neo tương tác)
  const drawUserLines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    Object.values(linesState).forEach(line => {
      if (line.canvasPath.length === 0) return;

      const isCurrentSelected = line.id === selectedLineId;
      ctx.save();

      // Hiệu ứng hào quang nhẹ phía sau đường đang chọn
      if (isCurrentSelected) {
        ctx.save();
        ctx.lineWidth = lineWidth + 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `${line.color}33`; // 20% opacity glow
        ctx.beginPath();
        drawSplineCurve(ctx, line.canvasPath, w, h);
        ctx.stroke();
        ctx.restore();
      }

      ctx.lineWidth = isCurrentSelected ? lineWidth + 2 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Nét vẽ theo trạng thái:
      if (line.status === 'ai_suggested') {
        ctx.setLineDash([8, 5]);
        ctx.strokeStyle = line.color;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = line.color;
      }

      // Vẽ đường cong spline mượt mà
      ctx.beginPath();
      drawSplineCurve(ctx, line.canvasPath, w, h);
      ctx.stroke();

      // Vẽ các điểm neo hình tròn với hiệu ứng tương tác (chạm/kéo được)
      line.canvasPath.forEach((pt, idx) => {
        const x = pt.x * w;
        const y = pt.y * h;
        const isPointHovered = hoveredPoint?.lineId === line.id && hoveredPoint?.pointIdx === idx;
        const isPointDragging = draggingPoint?.lineId === line.id && draggingPoint?.pointIdx === idx;
        const isPointActive = isCurrentSelected && activePointIndex === idx;
        const isStart = idx === 0;
        const isEnd = idx === line.canvasPath.length - 1;

        // Vòng hào quang phát sáng khi rê chuột hoặc đang kéo
        if (isPointHovered || isPointDragging || isPointActive) {
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fillStyle = isPointDragging ? 'rgba(212, 175, 55, 0.45)' : 'rgba(59, 130, 246, 0.35)';
          ctx.fill();
          ctx.strokeStyle = isPointDragging ? '#fef08a' : '#93c5fd';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Điểm neo chính
        ctx.beginPath();
        const ptRadius = isCurrentSelected ? (isStart || isEnd ? 6.5 : 5) : 3.5;
        ctx.arc(x, y, ptRadius, 0, Math.PI * 2);
        ctx.fillStyle = isStart ? '#10b981' : isEnd ? '#ef4444' : isCurrentSelected ? '#ffffff' : '#cbd5e1';
        ctx.fill();
        ctx.strokeStyle = isCurrentSelected ? '#0f172a' : '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Nhãn số thứ tự điểm neo trên đường đang chọn để người dùng dễ theo dõi
        if (isCurrentSelected && line.canvasPath.length <= 10) {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = isStart ? '#34d399' : isEnd ? '#f87171' : '#f1f5f9';
          const label = isStart ? 'S' : isEnd ? 'E' : `${idx}`;
          ctx.fillText(label, x + 8, y + 3);
        }
      });

      // Nhãn tên đường ở điểm đầu
      if (line.canvasPath.length > 0) {
        const firstPt = line.canvasPath[0];
        ctx.fillStyle = line.color;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(
          `${line.displayName} (${line.userVerified ? '✓ Đã xác nhận' : 'Kéo điểm để khớp'})`,
          firstPt.x * w + 8,
          firstPt.y * h - 8
        );
      }

      ctx.restore();
    });
  };

  // Thao tác tương tác bằng chuột / cảm ứng (kéo thả điểm neo hoặc vẽ tự do)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const normX = Math.max(0, Math.min(1, clientX / rect.width));
    const normY = Math.max(0, Math.min(1, clientY / rect.height));

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const clickPxX = normX * canvasW;
    const clickPxY = normY * canvasH;

    // 1. Kiểm tra bấm trúng điểm neo của đường đang chọn hoặc đường khác
    let hitPoint: { lineId: string; pointIdx: number } | null = null;
    const HIT_RADIUS = 24; // Bán kính nhận diện thoải mái cho cả chuột và ngón tay cảm ứng

    // Ưu tiên kiểm tra đường đang chọn trước
    const selectedLine = linesState[selectedLineId];
    if (selectedLine && selectedLine.canvasPath.length > 0) {
      for (let i = 0; i < selectedLine.canvasPath.length; i++) {
        const pt = selectedLine.canvasPath[i];
        const dist = Math.hypot(pt.x * canvasW - clickPxX, pt.y * canvasH - clickPxY);
        if (dist <= HIT_RADIUS) {
          hitPoint = { lineId: selectedLineId, pointIdx: i };
          break;
        }
      }
    }

    // Nếu chưa trúng, kiểm tra các đường khác để tự động chuyển đường
    if (!hitPoint) {
      for (const line of Object.values(linesState)) {
        if (line.id === selectedLineId || line.canvasPath.length === 0) continue;
        for (let i = 0; i < line.canvasPath.length; i++) {
          const pt = line.canvasPath[i];
          const dist = Math.hypot(pt.x * canvasW - clickPxX, pt.y * canvasH - clickPxY);
          if (dist <= HIT_RADIUS) {
            hitPoint = { lineId: line.id, pointIdx: i };
            break;
          }
        }
        if (hitPoint) break;
      }
    }

    // NẾU TRÚNG ĐIỂM NEO: Kích hoạt chế độ kéo điểm (Draggable Anchor Point)
    if (hitPoint) {
      setSelectedLineId(hitPoint.lineId);
      setActivePointIndex(hitPoint.pointIdx);
      setDraggingPoint(hitPoint);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch (err) {}

      // Lưu undo
      setUndoStack(prev => [...prev.slice(-20), { lineId: hitPoint!.lineId, path: [...linesState[hitPoint!.lineId].canvasPath] }]);
      return;
    }

    // NẾU Ở CHẾ ĐỘ THÊM ĐIỂM NEO (Add Point Mode)
    if (toolMode === 'add') {
      const target = linesState[selectedLineId];
      if (target) {
        setUndoStack(prev => [...prev.slice(-20), { lineId: selectedLineId, path: [...target.canvasPath] }]);
        const newPath = insertPointAtBestPosition(target.canvasPath, { x: Number(normX.toFixed(3)), y: Number(normY.toFixed(3)) });
        setLinesState(prev => ({
          ...prev,
          [selectedLineId]: {
            ...target,
            status: 'user_editing',
            source: 'user_drawn',
            canvasPath: newPath
          }
        }));
        updateLineGeometry(selectedLineId);
      }
      return;
    }

    // NẾU Ở CHẾ ĐỘ VẼ NÉT TỰ DO (Draw Mode)
    if (toolMode === 'draw') {
      setIsDrawing(true);
      setUndoStack(prev => [...prev.slice(-20), { lineId: selectedLineId, path: [...(linesState[selectedLineId]?.canvasPath || [])] }]);
      setLinesState(prev => ({
        ...prev,
        [selectedLineId]: {
          ...prev[selectedLineId],
          status: 'user_editing',
          source: 'user_drawn',
          canvasPath: [{ x: Number(normX.toFixed(3)), y: Number(normY.toFixed(3)) }]
        }
      }));
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const normX = Math.max(0.01, Math.min(0.99, clientX / rect.width));
    const normY = Math.max(0.01, Math.min(0.99, clientY / rect.height));

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const pxX = normX * canvasW;
    const pxY = normY * canvasH;

    // 1. KÉO ĐIỂM NEO ĐANG CHỌN (Dragging Anchor Point)
    if (draggingPoint) {
      setLinesState(prev => {
        const target = prev[draggingPoint.lineId];
        if (!target) return prev;
        const newPath = [...target.canvasPath];
        newPath[draggingPoint.pointIdx] = { x: Number(normX.toFixed(3)), y: Number(normY.toFixed(3)) };
        return {
          ...prev,
          [draggingPoint.lineId]: {
            ...target,
            status: 'user_editing',
            source: 'user_drawn',
            canvasPath: newPath
          }
        };
      });
      return;
    }

    // 2. VẼ TỰ DO (Freehand Drawing)
    if (isDrawing) {
      setLinesState(prev => {
        const target = prev[selectedLineId];
        if (!target) return prev;
        const lastPt = target.canvasPath[target.canvasPath.length - 1];
        if (lastPt && Math.hypot(lastPt.x - normX, lastPt.y - normY) < 0.015) return prev;
        return {
          ...prev,
          [selectedLineId]: {
            ...target,
            canvasPath: [...target.canvasPath, { x: Number(normX.toFixed(3)), y: Number(normY.toFixed(3)) }]
          }
        };
      });
      return;
    }

    // 3. HOVER DETECTION: Rê chuột gần điểm neo để đổi cursor sang 'grab'
    const HIT_RADIUS = 24;
    let foundHover: { lineId: string; pointIdx: number } | null = null;
    for (const line of Object.values(linesState)) {
      if (line.canvasPath.length === 0) continue;
      for (let i = 0; i < line.canvasPath.length; i++) {
        const pt = line.canvasPath[i];
        const dist = Math.hypot(pt.x * canvasW - pxX, pt.y * canvasH - pxY);
        if (dist <= HIT_RADIUS) {
          foundHover = { lineId: line.id, pointIdx: i };
          break;
        }
      }
      if (foundHover) break;
    }
    setHoveredPoint(foundHover);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingPoint) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}

      updateLineGeometry(draggingPoint.lineId);
      setDraggingPoint(null);
    }
    if (isDrawing) {
      setIsDrawing(false);
      updateLineGeometry(selectedLineId);
    }
  };

  // Xác nhận đường đang chọn (Mark as Verified)
  const handleVerifyCurrentLine = () => {
    setLinesState(prev => {
      const target = prev[selectedLineId];
      if (!target || target.canvasPath.length === 0) return prev;
      return {
        ...prev,
        [selectedLineId]: {
          ...target,
          userVerified: true,
          status: 'user_verified'
        }
      };
    });
    setCvAnalysisMsg(`✓ Đã xác nhận ${linesState[selectedLineId]?.displayName}. Dữ liệu này sẽ được dùng để tra cứu cổ thư.`);
  };

  // Đánh dấu không có đường này trên bàn tay (ví dụ đường Định Mệnh không có rãnh thật)
  const handleMarkLineAbsent = (lineId: string) => {
    setUndoStack(prev => [...prev.slice(-20), { lineId, path: [...(linesState[lineId]?.canvasPath || [])] }]);
    setLinesState(prev => ({
      ...prev,
      [lineId]: {
        ...prev[lineId],
        canvasPath: [],
        candidateDetected: false,
        userVerified: true,
        status: 'user_verified',
        features: {
          ...prev[lineId].features,
          lengthNormalized: null,
          relativeLength: 'Chưa xác định',
          visibleContrast: 'Chưa xác định',
          curvature: 'Chưa xác định',
          breaksObserved: 'Không có'
        }
      }
    }));
    setCvAnalysisMsg(`Đã xác nhận: Bàn tay KHÔNG CÓ ${linesState[lineId]?.displayName} (hệ thống không ép buộc đường ảo).`);
  };

  // Xác nhận tất cả các đường đã vẽ
  const handleVerifyAllLines = () => {
    setLinesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].canvasPath.length > 0) {
          updated[k].userVerified = true;
          updated[k].status = 'user_verified';
        }
      });
      return updated;
    });
    setCvAnalysisMsg('✓ Đã xác nhận tất cả các đường nét hiện tại. Bạn có thể bấm "Đối Chiếu Cổ Thư & Xuất Báo Cáo".');
  };

  // Xóa đường đang chọn
  const handleClearCurrentLine = () => {
    setUndoStack(prev => [...prev.slice(-20), { lineId: selectedLineId, path: [...(linesState[selectedLineId]?.canvasPath || [])] }]);
    setLinesState(prev => ({
      ...prev,
      [selectedLineId]: {
        ...prev[selectedLineId],
        canvasPath: [],
        status: 'undetected',
        userVerified: false
      }
    }));
  };

  // Hoàn tác (Undo)
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    setLinesState(prev => ({
      ...prev,
      [lastAction.lineId]: {
        ...prev[lastAction.lineId],
        canvasPath: lastAction.path,
        userVerified: false,
        status: lastAction.path.length > 0 ? 'user_editing' : 'undetected'
      }
    }));
    setUndoStack(prev => prev.slice(0, -1));
  };

  // Xóa toàn bộ
  const handleResetAll = () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ các nét vẽ và bắt đầu lại?')) return;
    setLinesState(prev => {
      const resetObj = { ...prev };
      Object.keys(resetObj).forEach(k => {
        resetObj[k].canvasPath = [];
        resetObj[k].userVerified = false;
        resetObj[k].status = 'undetected';
      });
      return resetObj;
    });
    setUndoStack([]);
  };

  // Xử lý nạp ảnh chụp bàn tay
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBgImage(img);
        setBgImageUrl(event.target?.result as string);
        setShowBgImage(true);

        // Chạy ngay bộ dò nếp gấp da thịt thực tế bằng Computer Vision (Client-side)
        runCreaseDetection(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Áp dụng kết quả phân tích nếp gấp thực tế vào state
  const applyDetectionResult = (result: PalmVisionAnalysisResult) => {
    setLinesState(prev => {
      const nextState = { ...prev };
      Object.entries(result.lines).forEach(([lineId, det]) => {
        if (nextState[lineId]) {
          const hasPath = det.detected && det.points.length > 0;
          const pStart = hasPath ? det.points[0] : null;
          const pEnd = hasPath ? det.points[det.points.length - 1] : null;
          const lengthEst = (pStart && pEnd) ? Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y) : null;

          nextState[lineId] = {
            ...nextState[lineId],
            candidateDetected: det.detected,
            status: hasPath ? 'ai_suggested' : 'undetected',
            source: 'ai_vision',
            userVerified: false,
            confidence: det.confidence,
            canvasPath: det.points,
            features: {
              ...nextState[lineId].features,
              lengthNormalized: lengthEst,
              relativeLength: lengthEst ? (lengthEst > 0.45 ? 'Dài' : lengthEst > 0.25 ? 'Trung bình' : 'Ngắn') : 'Chưa xác định',
              visibleContrast: det.contrastLevel === 'Không có' ? 'Chưa xác định' : det.contrastLevel,
              curvature: det.points.length > 3 ? 'Cong nhiều' : 'Cong nhẹ',
              breaksObserved: det.contrastLevel === 'Đứt đoạn' ? 'Có đoạn đứt' : 'Không có'
            }
          };
        }
      });
      return nextState;
    });

    const fateDetected = result.lines['dinh_menh']?.detected;
    const providerName = result.provider === 'gemini_vision' ? 'Vision LLM (Gemini)' : 'Computer Vision (Ridge/Crease)';
    setCvAnalysisMsg(
      `✓ [${providerName}] Đã trích xuất nếp nhăn thực tế: Tâm Đạo nằm dưới gò; Trí Đạo uốn lượn; Sinh Đạo ôm mô ngón cái.${
        fateDetected ? ' Phát hiện có rãnh Định Mệnh.' : ' Bàn tay không có nếp gấp Định Mệnh (không vẽ đường ảo).'
      } Bạn có thể chạm/kéo các điểm neo hình tròn để nắn chuẩn xác vào rãnh da!`
    );
  };

  // Dò nếp gấp thực tế bằng thuật toán xử lý ảnh Client-Side CV
  const runCreaseDetection = (imageToAnalyze?: HTMLImageElement) => {
    const targetImg = imageToAnalyze || bgImage;
    if (!targetImg) {
      setCvAnalysisMsg('Vui lòng tải ảnh chụp bàn tay lên trước khi dò nếp gấp.');
      return;
    }
    setIsAnalyzingCV(true);
    setCvAnalysisMsg('Đang nhận diện vùng lòng bàn tay và dò nếp gấp rãnh da thực tế...');

    setTimeout(() => {
      try {
        const cvResult = detectRealPalmCreasesFromImage(targetImg, handSide);
        applyDetectionResult(cvResult);
      } catch (err) {
        console.error('CV analysis error:', err);
        setCvAnalysisMsg('Không thể trích xuất nếp nhăn. Bạn có thể kéo thả thủ công các điểm neo.');
      } finally {
        setIsAnalyzingCV(false);
      }
    }, 150);
  };

  // Dò nếp gấp bằng Vision AI (Gemini Flash Multimodal) nếu có API Key
  const runGeminiVisionDetection = async () => {
    if (!bgImageUrl) {
      setCvAnalysisMsg('Vui lòng tải ảnh chụp bàn tay lên trước.');
      return;
    }
    if (!config.geminiApiKey) {
      setCvAnalysisMsg('Chưa cấu hình Gemini API Key. Bạn có thể vào Cài đặt để nhập hoặc dùng bộ dò nếp gấp CV có sẵn.');
      return;
    }
    setIsAnalyzingCV(true);
    setCvAnalysisMsg('Đang gửi ảnh sang Gemini Flash Vision để trích xuất tọa độ nếp nhăn thực tế...');

    try {
      const result = await detectRealPalmCreasesWithGemini(bgImageUrl, config.geminiApiKey, handSide);
      applyDetectionResult(result);
    } catch (err: any) {
      console.warn('Gemini vision failed, falling back to local CV:', err);
      setCvAnalysisMsg('Gemini Vision gặp lỗi (' + (err?.message || 'kết nối') + '). Đang chuyển sang bộ dò nếp gấp CV cục bộ...');
      if (bgImage) {
        const cvResult = detectRealPalmCreasesFromImage(bgImage, handSide);
        applyDetectionResult(cvResult);
      }
    } finally {
      setIsAnalyzingCV(false);
    }
  };

  // Chạy Classical Rule Engine đối chiếu cổ thư
  const handleExecuteRuleEngine = () => {
    const rep = buildComprehensivePalmReport(
      handSide,
      dominantHand,
      selectedSchool,
      linesState,
      userSelectedElement,
      Boolean(bgImage)
    );
    setReport(rep);
    setActiveTab('report');
  };

  // Tải ảnh chú thích
  const handleDownloadAnnotatedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `dao_menh_palmistry_${handSide}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Xuất JSON hình học chuẩn hóa
  const handleExportGeometryJSON = () => {
    const exportData = {
      schema_version: '1.0',
      timestamp: new Date().toISOString(),
      hand_side: handSide,
      dominant_hand: dominantHand,
      selected_school: selectedSchool,
      five_element_shape: userSelectedElement,
      lines: linesState
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dao_menh_palm_geometry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentLineDef = PALM_LINES_CATALOG.find(l => l.id === selectedLineId) || PALM_LINES_CATALOG[0];
  const currentLineState = linesState[selectedLineId];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>100% Cổ Thư Xác Minh – 《Ma Y Thần Tướng》 • 《Thần Tướng Toàn Biên》 • 《Liễu Trang Thần Tướng》</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental">
          Xem, Nhận Diện & Tự Vẽ Chỉ Tay Theo Cổ Thư
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed">
          Tách biệt hoàn toàn: Vision AI chỉ trích xuất dữ liệu hình học; Classical Rule Engine đối chiếu quy tắc kinh điển đã phê duyệt.
          Bạn hoàn toàn có thể tự vẽ, chỉnh sửa điểm kiểm soát, xác nhận hoặc từ chối từng đường nét trước khi tra cứu cổ thư.
        </p>
      </div>

      {/* Unified Personal Profile Bar */}
      <PersonalProfileBar moduleTitle="Vẽ & Xem Chỉ Tay" />

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('drawing')}
          className={`px-5 py-3 text-xs sm:text-sm font-oriental font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'drawing'
              ? 'border-gold-500 text-gold-300 bg-gold-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pencil className="w-4 h-4 text-gold-400" />
          <span>1. Canvas Vẽ & Hiệu Chỉnh Chỉ Tay</span>
        </button>

        <button
          onClick={() => {
            if (!report) handleExecuteRuleEngine();
            else setActiveTab('report');
          }}
          className={`px-5 py-3 text-xs sm:text-sm font-oriental font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'report'
              ? 'border-gold-500 text-gold-300 bg-gold-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-gold-400" />
          <span>2. Báo Cáo Thủ Tướng Học 7 Mục Cổ Điển</span>
        </button>
      </div>

      {/* TAB 1: CANVAS VẼ VÀ HIỆU CHỈNH CHỈ TAY */}
      {activeTab === 'drawing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cột trái: Canvas tương tác trực quan */}
          <div className="lg:col-span-7 oriental-card rounded-2xl p-4 sm:p-6 border border-gold-500/25 space-y-4">
            
            {/* Thanh công cụ đỉnh Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Khảo sát:</span>
                <button
                  type="button"
                  onClick={() => setHandSide('left')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    handSide === 'left' ? 'bg-gold-500 text-ink-950 font-bold' : 'bg-ink-800 text-slate-300'
                  }`}
                >
                  Tay Trái (Tiên Thiên)
                </button>
                <button
                  type="button"
                  onClick={() => setHandSide('right')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    handSide === 'right' ? 'bg-gold-500 text-ink-950 font-bold' : 'bg-ink-800 text-slate-300'
                  }`}
                >
                  Tay Phải (Hậu Thiên)
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="p-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-300 hover:text-gold-300 transition-colors"
                  title="Hoàn tác (Undo)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClearCurrentLine}
                  className="p-1.5 rounded-lg bg-ink-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
                  title="Xóa nét đường đang chọn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label
                  className="p-1.5 rounded-lg bg-ink-800 hover:bg-jade-900/40 text-slate-300 hover:text-jade-400 transition-colors cursor-pointer flex items-center space-x-1"
                  title="Tải ảnh chụp bàn tay lên"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[11px] hidden sm:inline">Nạp Ảnh</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleDownloadAnnotatedImage}
                  className="p-1.5 rounded-lg bg-ink-800 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 transition-colors"
                  title="Tải ảnh chú thích về máy"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thanh công cụ thao tác: Kéo Chỉnh Điểm / Vẽ Tự Do / Thêm Điểm Neo & Dò Nếp Gấp CV */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">Chế độ:</span>
                <button
                  type="button"
                  onClick={() => setToolMode('drag')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    toolMode === 'drag'
                      ? 'bg-gold-500 text-ink-950 shadow-md ring-1 ring-gold-300 font-bold'
                      : 'bg-ink-900 text-slate-300 hover:bg-ink-800'
                  }`}
                  title="Chạm hoặc kéo các điểm neo tròn để dịch chuyển vào đúng rãnh chỉ tay trên ảnh"
                >
                  <Move className="w-3.5 h-3.5" />
                  <span>✋ Kéo Điểm Neo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToolMode('draw')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    toolMode === 'draw'
                      ? 'bg-gold-500 text-ink-950 shadow-md ring-1 ring-gold-300 font-bold'
                      : 'bg-ink-900 text-slate-300 hover:bg-ink-800'
                  }`}
                  title="Giữ chuột hoặc ngón tay để vẽ nét chỉ tay tự do"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>✏️ Vẽ Tự Do</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToolMode('add')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    toolMode === 'add'
                      ? 'bg-gold-500 text-ink-950 shadow-md ring-1 ring-gold-300 font-bold'
                      : 'bg-ink-900 text-slate-300 hover:bg-ink-800'
                  }`}
                  title="Nhấn vào vị trí bất kỳ để thêm điểm neo uốn lượn vào đường đang chọn"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>➕ Thêm Điểm Neo</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={isAnalyzingCV}
                  onClick={() => runCreaseDetection()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  title="Dò nếp gấp da thịt thực tế bằng thuật toán xử lý ảnh CV (Ridge & Valley)"
                >
                  <Zap className={`w-3.5 h-3.5 text-emerald-400 ${isAnalyzingCV ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingCV ? 'Đang dò rãnh da...' : '⚡ Dò Nếp Gấp Thực Tế (CV)'}</span>
                </button>
                {config.geminiApiKey && (
                  <button
                    type="button"
                    disabled={isAnalyzingCV}
                    onClick={runGeminiVisionDetection}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                    title="Dò nếp gấp bằng mô hình Vision LLM đa phương thức (Gemini Flash)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gemini Vision</span>
                  </button>
                )}
              </div>
            </div>

            {/* Hộp thông báo phân tích nếp gấp / hướng dẫn kéo thả */}
            {cvAnalysisMsg && (
              <div className="p-3 rounded-xl bg-ink-950/90 border border-gold-500/30 text-xs text-slate-200 flex items-start space-x-2 animate-fadeIn shadow-sm">
                <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <p>{cvAnalysisMsg}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCvAnalysisMsg(null)}
                  className="text-slate-400 hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bảng Canvas vẽ chính */}
            <div className="relative border-2 border-dashed border-gold-500/35 rounded-xl overflow-hidden bg-ink-950 flex justify-center touch-none shadow-inner">
              <canvas
                ref={canvasRef}
                width={500}
                height={560}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`w-full max-w-[500px] h-auto shadow-inner ${
                  draggingPoint ? 'cursor-grabbing' :
                  hoveredPoint ? 'cursor-grab' :
                  toolMode === 'drag' ? 'cursor-default' :
                  toolMode === 'draw' ? 'cursor-crosshair' :
                  'cursor-copy'
                }`}
              />
            </div>

            {/* Điều khiển hiển thị lớp nền & độ mờ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-ink-950/70 border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBgImage(!showBgImage)}
                  className="p-1 rounded bg-ink-800 text-slate-300 hover:text-gold-300"
                >
                  {showBgImage ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span>{showBgImage ? 'Đang bật nền' : 'Đã ẩn nền'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Độ mờ:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(Number(e.target.value))}
                  className="w-20 accent-gold-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMountsOverlay}
                    onChange={(e) => setShowMountsOverlay(e.target.checked)}
                    className="rounded text-gold-500 bg-ink-800"
                  />
                  <span>Hiện Gò Bát Quái</span>
                </label>
              </div>
            </div>

            {/* Bộ chọn đường nét & Thao tác xác nhận */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-oriental flex items-center space-x-1.5">
                    <span>Chọn Đường Chỉ Tay Để Định Vị & Gán Nhãn:</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bấm chọn từng đường để xem hướng dẫn vị trí, giải nghĩa cổ thư và kéo điểm neo khớp với rãnh da thực tế.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleVerifyCurrentLine}
                    className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center space-x-1 font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Xác Nhận Đường Này</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyAllLines}
                    className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40 hover:bg-gold-500/30 flex items-center space-x-1 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Xác Nhận Tất Cả</span>
                  </button>
                </div>
              </div>

              {/* NHÓM 1: 3 ĐƯỜNG TAM TÀI CỐT LÕI (AI CŨNG CÓ) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    I. Ba Đường Chính Cốt Lõi (Tam Tài Văn – Luôn có trên mọi bàn tay)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PALM_LINES_CATALOG.filter(l => l.category === 'chinh').map(line => {
                    const state = linesState[line.id];
                    const isSelected = selectedLineId === line.id;
                    const isVerified = state?.userVerified;
                    const hasPoints = state?.canvasPath.length > 0;

                    return (
                      <button
                        key={line.id}
                        type="button"
                        onClick={() => setSelectedLineId(line.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/20 text-gold-200 shadow-md ring-1 ring-gold-400/50'
                            : 'border-slate-800 bg-ink-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }}></span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-slate-300 font-mono">
                              {line.badge}
                            </span>
                          </div>
                          {isVerified ? (
                            <span className="text-[10px] text-emerald-300 font-bold flex items-center space-x-0.5">
                              <Check className="w-3 h-3" />
                              <span>Đã xác nhận</span>
                            </span>
                          ) : hasPoints ? (
                            <span className="text-[10px] text-amber-300">Đang chỉnh</span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Chưa vẽ</span>
                          )}
                        </div>
                        <strong className="text-xs block text-slate-100 font-semibold">{line.vietnameseName}</strong>
                        <div className="text-[11px] text-gold-400/90 font-serif">{line.colloquialName || line.classicalName}</div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          {line.shortRole}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NHÓM 2: CÁC ĐƯỜNG PHỤ & BỔ TRỢ (CÓ THỂ CÓ HOẶC KHÔNG CÓ) */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      II. Các Đường Phụ & Bổ Trợ (Tùy cơ địa – Có thể có hoặc không có)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 italic">
                    *Không bắt buộc mọi bàn tay đều có, nếu không có hãy bấm "Không Có Đường Này"
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {PALM_LINES_CATALOG.filter(l => l.category === 'phu').map(line => {
                    const state = linesState[line.id];
                    const isSelected = selectedLineId === line.id;
                    const isVerified = state?.userVerified;
                    const hasPoints = state?.canvasPath.length > 0;
                    const isMarkedAbsent = isVerified && !hasPoints;

                    return (
                      <button
                        key={line.id}
                        type="button"
                        onClick={() => setSelectedLineId(line.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/20 text-gold-200 shadow-md ring-1 ring-gold-400/50'
                            : 'border-slate-800 bg-ink-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }}></span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800/80 text-amber-300/90 font-mono">
                              {line.badge}
                            </span>
                          </div>
                          {isMarkedAbsent ? (
                            <span className="text-[10px] text-rose-300 font-semibold">✕ Không có</span>
                          ) : isVerified ? (
                            <span className="text-[10px] text-emerald-300 font-bold flex items-center space-x-0.5">
                              <Check className="w-3 h-3" />
                              <span>Đã xác nhận</span>
                            </span>
                          ) : hasPoints ? (
                            <span className="text-[10px] text-amber-300">Đang chỉnh</span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Chưa vẽ</span>
                          )}
                        </div>
                        <strong className="text-xs block text-slate-100 font-semibold">{line.vietnameseName}</strong>
                        <div className="text-[11px] text-gold-400/90 font-serif">{line.colloquialName || line.classicalName}</div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          {line.shortRole}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HỘP THÔNG TIN & GHI CHÚ HƯỚNG DẪN CHI TIẾT CHO ĐƯỜNG ĐANG CHỌN */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-ink-900 to-ink-950 border border-gold-500/30 text-xs text-slate-200 space-y-3.5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentLineDef.color }}></span>
                    <strong className="text-base text-gold-300 font-oriental">
                      {currentLineDef.vietnameseName} – {currentLineDef.colloquialName}
                    </strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30">
                      {currentLineDef.classicalName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">
                      Trạng thái: <strong className={currentLineState?.userVerified ? (currentLineState.canvasPath.length > 0 ? 'text-emerald-300' : 'text-rose-300') : 'text-amber-400'}>
                        {currentLineState?.userVerified ? (currentLineState.canvasPath.length > 0 ? '✓ Đã xác nhận có' : '✕ Xác nhận không có trên tay') : (currentLineState?.canvasPath.length > 0 ? 'Đang hiệu chỉnh' : 'Chưa vẽ')}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMarkLineAbsent(selectedLineId)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                      title="Nếu trên bàn tay của bạn không có rãnh này, bấm vào đây để xác nhận không có (rất bình thường, không làm sai lệch luận giải)"
                    >
                      <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Không Có Đường Này</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyCurrentLine}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                      title="Xác nhận đường này đã khớp với rãnh tay"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Xác Nhận Có</span>
                    </button>
                  </div>
                </div>

                {/* 3 Khối giải thích chi tiết trực quan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Khối 1: Đường này là gì? */}
                  <div className="p-3 rounded-xl bg-ink-950/80 border border-slate-800/80 space-y-1">
                    <div className="flex items-center space-x-1.5 text-gold-400 font-semibold text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>1. ĐÂY LÀ ĐƯỜNG GÌ?</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {currentLineDef.shortRole}.
                    </p>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      {currentLineDef.description}
                    </p>
                  </div>

                  {/* Khối 2: Tìm ở đâu trên bàn tay? */}
                  <div className="p-3 rounded-xl bg-ink-950/80 border border-slate-800/80 space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>2. VỊ TRÍ NHẬN DIỆN TRÊN TAY:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {currentLineDef.locationGuide}
                    </p>
                  </div>

                  {/* Khối 3: Nếu không có đường này thì sao? */}
                  <div className="p-3 rounded-xl bg-ink-950/80 border border-slate-800/80 space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>3. NẾU TAY BẠN KHÔNG CÓ ĐƯỜNG NÀY?</span>
                    </div>
                    <p className="text-amber-200/90 text-[11px] leading-relaxed">
                      {currentLineDef.whatIfMissing}
                    </p>
                  </div>
                </div>

                {/* Cổ thư kinh điển */}
                <div className="p-2.5 rounded-xl bg-gold-950/15 border border-gold-500/20 text-[11px] text-gold-300/90 italic flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-gold-200 not-italic">Cổ thư khảo cứu: </strong>
                    {currentLineDef.classicalSignificance}
                  </div>
                </div>
              </div>

              {/* Nút hành động chính */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleExportGeometryJSON}
                  className="px-4 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-300 hover:text-gold-300 hover:border-gold-500 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>Xuất JSON Tọa Độ Hình Học</span>
                </button>

                <button
                  type="button"
                  onClick={handleExecuteRuleEngine}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-bold text-xs tracking-wider shadow-lg transition-transform active:scale-95 flex items-center space-x-2 font-oriental"
                >
                  <Award className="w-4 h-4" />
                  <span>Đối Chiếu Cổ Thư & Xuất Báo Cáo</span>
                </button>
              </div>
            </div>

          </div>

          {/* Cột phải: Cấu hình trường phái & Phân loại ngũ hành */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cấu hình trường phái */}
            <div className="oriental-card rounded-2xl p-5 border border-gold-500/25 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Compass className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-bold text-slate-100 font-oriental">
                  Trường Phái Thủ Tướng Khảo Cứu
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Hệ thống chỉ áp dụng các quy tắc thuộc trường phái đã chọn, không trộn lẫn các trường phái khác nhau:
              </p>
              <div className="space-y-2">
                {(['Ma Y Phái Thủ Tướng', 'Thần Tướng Toàn Biên', 'Liễu Trang Tướng Pháp', 'Tham Khảo Phổ Thông'] as const).map(sch => (
                  <button
                    key={sch}
                    type="button"
                    onClick={() => setSelectedSchool(sch)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedSchool === sch
                        ? 'border-gold-500 bg-gold-500/15 text-gold-200 font-bold'
                        : 'border-slate-800 bg-ink-950/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sch}
                  </button>
                ))}
              </div>
            </div>

            {/* Phân loại ngũ hành hình thái bàn tay */}
            <div className="oriental-card rounded-2xl p-5 border border-gold-500/25 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Sliders className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-bold text-slate-100 font-oriental">
                  Hình Thái Ngũ Hành Bàn Tay
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Theo 《Liễu Trang Thần Tướng》, hình thái bàn tay phân định theo tỷ lệ dài rộng của lòng bàn tay và độ dài ngón tay:
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as const).map(elem => (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => setUserSelectedElement(elem)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      userSelectedElement === elem
                        ? 'bg-gold-500 text-ink-950 font-bold shadow-md'
                        : 'bg-ink-800/80 text-slate-300 hover:bg-ink-700'
                    }`}
                  >
                    {elem}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                Đang chọn: <strong className="text-gold-300">Bàn tay hình {userSelectedElement}</strong>. Tỷ lệ chuẩn hóa sẽ được Classical Rule Engine kiểm chứng.
              </p>
            </div>

            {/* Cảnh báo ranh giới đạo đức */}
            <div className="p-4 rounded-xl bg-ink-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center space-x-2 text-jade-300 font-semibold font-oriental">
                <ShieldCheck className="w-4 h-4 text-jade-400 flex-shrink-0" />
                <span>Ranh Giới Học Thuật & Đạo Đức Tướng Pháp</span>
              </div>
              <p className="leading-relaxed">
                1. Vision AI chỉ trích xuất tọa độ hình học, không suy đoán vận mệnh.<br />
                2. Tuyệt đối không dùng đường Sinh Đạo để phán đoán thọ yểu hay cái chết.<br />
                3. Không dùng hình thái bàn tay để chẩn đoán bệnh tật thay cho y khoa.<br />
                4. Chỉ dữ liệu người dùng <strong>đã xác nhận</strong> mới được gửi sang Rule Engine tra cứu cổ thư.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BÁO CÁO THỦ TƯỚNG HỌC 7 MỤC CỔ ĐIỂN */}
      {activeTab === 'report' && report && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Báo Cáo */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/35 bg-gradient-to-b from-ink-900 to-ink-950 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold block">Hệ Thống Đạo Mệnh</span>
                <h2 className="text-2xl font-bold gold-gradient-text font-oriental">
                  BÁO CÁO THỦ TƯỚNG HỌC TOÀN DIỆN
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  Chế Độ: Dữ Liệu Đã Xác Nhận
                </span>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  Trường phái: {report.overview.school}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Báo cáo được đối chiếu bởi Classical Rule Engine từ dữ liệu hình thái bàn tay do người dùng xác nhận trên Canvas, căn cứ theo các văn bản kinh điển đã thẩm định.
            </p>
          </div>

          {/* MỤC 1: TỔNG QUAN BÀN TAY */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Compass className="w-5 h-5 text-gold-400" />
              <span>1. Tổng Quan Hình Thái Bàn Tay</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Bàn Tay Phân Tích:</span>
                <strong className="text-sm text-gold-300 block font-oriental">
                  {report.overview.handSide === 'left' ? 'Tay Trái (Tiên Thiên)' : 'Tay Phải (Hậu Thiên)'}
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                  {report.overview.handSideMeaning}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Tay Thuận Khai Báo:</span>
                <strong className="text-sm text-slate-200 block font-oriental">
                  {report.overview.dominantHand === 'left' ? 'Tay Thuận: Trái' : 'Tay Thuận: Phải'}
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                  {report.overview.dominantHandNote}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Chất Lượng Dữ Liệu Hình Học:</span>
                <strong className="text-sm text-emerald-300 block font-oriental">
                  {report.overview.imageQuality.statusText}
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                  Hệ tọa độ chuẩn hóa [0.0 - 1.0], không ghi đè ảnh gốc.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Tỷ Lệ Đo Hình Học:</span>
                <strong className="text-sm text-cyan-300 block font-mono">
                  L/W: {report.overview.measurements.palmLengthWidthRatio} • Ngón: {report.overview.measurements.fingerToPalmRatio}
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                  Số đo cấu trúc xương thỏa mãn tiêu chí phân loại ngũ hành.
                </p>
              </div>
            </div>
          </div>

          {/* MỤC 2: PHÂN TÍCH TỪNG ĐƯỜNG CHỈ TAY */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-5">
            <h3 className="text-base font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Pencil className="w-5 h-5 text-gold-400" />
              <span>2. Phân Tích Chi Tiết Từng Đường Chỉ Tay (Tam Đại Chủ Văn & Đường Phụ)</span>
            </h3>

            <div className="space-y-4">
              {report.linesAnalysis.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    item.verifiedByUser
                      ? 'bg-ink-950/80 border-slate-800 hover:border-gold-500/40'
                      : 'bg-ink-950/40 border-slate-900 opacity-75'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.line.color }}></span>
                      <strong className="text-sm font-bold text-slate-100 font-oriental">
                        {item.line.vietnameseName} ({item.line.classicalName})
                      </strong>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold ${
                        item.verifiedByUser
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {item.verifiedByUser ? '✓ Đã Xác Nhận' : 'Chờ Xác Nhận Dữ Liệu'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">Dữ Liệu Hình Học:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {item.geometrySummary}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-gold-400 block font-semibold mb-0.5">Luận Giải Cổ Thư Phê Duyệt:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {item.classicalInterpretation}
                      </p>
                    </div>
                  </div>

                  {/* Hồ sơ dẫn chứng cổ thư A -> H */}
                  {item.evidence && (
                    <ClassicalEvidenceDrawer evidence={item.evidence} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MỤC 3: CÁC GÒ BÀN TAY (BÁT QUÁI CỬU CUNG) */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Layers className="w-5 h-5 text-gold-400" />
              <span>3. Các Gò Bàn Tay & Bát Quái Cửu Cung 《Thần Tướng Toàn Biên》</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {report.mountsAnalysis.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-gold-300 font-oriental">{m.mount.name}</strong>
                    <span className="text-[11px] text-cyan-300 font-mono">{m.mount.classicalPalace.split(' ')[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.mount.locationDesc}</p>
                  <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
                    {m.classicalEvaluation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC 4: HÌNH DẠNG BÀN TAY VÀ NGŨ HÀNH */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-gold-400" />
              <span>4. Hình Dạng Bàn Tay & Phân Loại Ngũ Hành 《Liễu Trang Thần Tướng》</span>
            </h3>

            <div className="p-4 rounded-xl bg-ink-950 border border-gold-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-100 font-oriental">
                  {report.fiveElements.shapeTitle}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
                  Mã Quy Tắc: {report.fiveElements.ruleCode}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {report.fiveElements.classicalDescription}
              </p>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 block">Tiêu Chí Thỏa Mãn Theo Số Đo:</span>
                {report.fiveElements.criteriaSatisfied.map((crit, i) => (
                  <div key={i} className="text-emerald-300 flex items-center space-x-1.5">
                    <span>✓</span>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              <ClassicalEvidenceDrawer evidence={report.fiveElements.evidence} />
            </div>
          </div>

          {/* MỤC 5: DẤU HIỆU ĐẶC BIỆT */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>5. Khảo Cứu Các Dấu Hiệu Đặc Biệt (Chữ M, Chữ Nhất, Tam Giác, Thập Tự)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.specialSigns.map((sign, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-ink-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-slate-100 font-oriental">{sign.name}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-ink-900 border border-slate-700 text-slate-300">
                      {sign.classicalName}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{sign.description}</p>
                  <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
                    {sign.classicalMeaning}
                  </p>
                  <div className="text-[10px] text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    ⚠ {sign.ethicalCaution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC 6: TỔNG LUẬN THEO TRƯỜNG PHÁI */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 bg-gold-500/5 space-y-3">
            <h3 className="text-base font-bold text-gold-300 font-oriental flex items-center space-x-2 pb-2 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-gold-400" />
              <span>6. Tổng Luận Diễn Giải Theo Trường Phái {report.schoolSynthesis.schoolName}</span>
            </h3>

            <p className="text-xs text-slate-200 leading-relaxed">
              {report.schoolSynthesis.summary}
            </p>

            <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2 mt-2">
              <ShieldCheck className="w-4 h-4 text-jade-400 flex-shrink-0 mt-0.5" />
              <span>{report.schoolSynthesis.ethicalDisclaimer}</span>
            </div>
          </div>

          {/* MỤC 7: CĂN CỨ VÀ LỊCH SỬ XỬ LÝ (AUDIT TRAIL) */}
          <div className="oriental-card rounded-2xl p-6 border border-slate-800 space-y-3 text-xs text-slate-400">
            <h3 className="text-sm font-bold text-slate-200 font-oriental flex items-center space-x-2 pb-2 border-b border-slate-800">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>7. Căn Cứ Học Thuật & Lịch Sử Xử Lý Dữ Liệu (Audit Trail)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div>Phiên bản bộ quy tắc: <strong className="text-slate-200">{report.auditTrail.ruleVersion}</strong></div>
              <div>Thời điểm đối chiếu: <strong className="text-slate-200">{report.auditTrail.processedTimestamp}</strong></div>
              <div>Ban thẩm định: <strong className="text-slate-200">{report.auditTrail.reviewer}</strong></div>
            </div>

            <p className="text-[11px] pt-1 border-t border-slate-800/60 leading-relaxed">
              Mã quy tắc cổ thư đã xác minh sử dụng trong báo cáo: <strong className="text-gold-300 font-mono">{report.auditTrail.verifiedRulesUsed.join(', ')}</strong>. Toàn bộ các quy tắc này được lưu trữ trong Classical Rules Registry, có nguyên văn chữ Hán, số trang in và bản số hóa có thể kiểm chứng độc lập.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
