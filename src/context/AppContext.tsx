/**
 * ĐẠO MỆNH – GLOBAL APPLICATION STATE
 * Quản lý cấu hình thương hiệu, hồ sơ người dùng, kết quả tính toán và lịch sử tra cứu
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BaziChart, generateBaziChart } from '../engine/bazi';
import { LiuZhuChart, generateLiuZhuChart, LiuZhuSchool } from '../engine/liuzhu';
import { TuViChart, generateTuViChart } from '../engine/tuvi';
import { convertSolarToLunar, HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../engine/calendar';

export interface UserProfile {
  fullName: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD
  birthHour: number; // 0 - 23
  birthMinute: number; // 0 - 59
}

export interface SystemConfig {
  brandName: string;
  slogan: string;
  aiProvider: 'gemini' | 'internal_heuristic';
  geminiApiKey?: string;
  defaultLiuZhuSchool: LiuZhuSchool;
  dayBoundaryMethod: 'zi_split' | 'midnight';
}

const DEFAULT_CONFIG: SystemConfig = {
  brandName: 'ĐẠO MỆNH – LỤC TRỤ MỆNH LÝ & HUYỀN HỌC PHƯƠNG ĐÔNG',
  slogan: 'Nền tảng nghiên cứu Bát Tự, Lục Trụ, Tử Vi Đẩu Số và Huyền học cổ truyền chuẩn xác',
  aiProvider: 'internal_heuristic',
  geminiApiKey: '',
  defaultLiuZhuSchool: 'classical_thai_menh',
  dayBoundaryMethod: 'zi_split'
};

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Nguyễn Văn An',
  gender: 'male',
  birthDate: '1990-01-01',
  birthHour: 1,
  birthMinute: 0
};

interface AppContextType {
  config: SystemConfig;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentProfile: UserProfile;
  // Current active calculated chart
  currentBaziChart: BaziChart;
  currentLiuZhuChart: LiuZhuChart;
  currentTuViChart: TuViChart;
  calculateAllCharts: (
    name: string,
    gender: 'male' | 'female',
    year: number,
    month: number,
    day: number,
    hour: number,
    minute?: number,
    school?: LiuZhuSchool
  ) => void;
  // Chart calculation history
  savedProfiles: {
    id: string;
    name: string;
    birthDate: string;
    createdAt: string;
  }[];
  saveCurrentProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('dao_menh_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('home');

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dao_menh_current_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let modified = false;
        if (parsed.fullName && parsed.fullName.toLowerCase().includes('đoàn')) {
          parsed.fullName = 'Nguyễn Văn An';
          modified = true;
        }
        if (parsed.birthDate === '2000-10-23' || (parsed.birthHour === 12 && parsed.birthMinute === 30)) {
          parsed.birthDate = '1990-01-01';
          parsed.birthHour = 1;
          parsed.birthMinute = 0;
          modified = true;
        }
        if (modified) {
          localStorage.setItem('dao_menh_current_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  // Khởi tạo lá số từ profile hiện tại
  const [initY, initM, initD] = currentProfile.birthDate.split('-').map(Number);
  const defaultBazi = generateBaziChart(currentProfile.fullName, currentProfile.gender, initY, initM, initD, currentProfile.birthHour, currentProfile.birthMinute);
  const defaultLiuZhu = generateLiuZhuChart(defaultBazi, config.defaultLiuZhuSchool, currentProfile.birthMinute);
  const lunar = convertSolarToLunar(initD, initM, initY);
  const canIndex = (lunar.year - 4) % 10;
  const chiIndex = (lunar.year - 4) % 12;
  const initTuViYearCan = HEAVENLY_STEMS[(canIndex + 10) % 10].name;
  const initTuViYearChi = EARTHLY_BRANCHES[(chiIndex + 12) % 12].name;
  const defaultTuVi = generateTuViChart(
    currentProfile.fullName,
    currentProfile.gender,
    initY,
    initM,
    initD,
    currentProfile.birthHour,
    lunar.day,
    lunar.month,
    initTuViYearCan,
    initTuViYearChi
  );

  const [currentBaziChart, setCurrentBaziChart] = useState<BaziChart>(defaultBazi);
  const [currentLiuZhuChart, setCurrentLiuZhuChart] = useState<LiuZhuChart>(defaultLiuZhu);
  const [currentTuViChart, setCurrentTuViChart] = useState<TuViChart>(defaultTuVi);

  const [savedProfiles, setSavedProfiles] = useState<{ id: string; name: string; birthDate: string; createdAt: string }[]>(() => {
    const saved = localStorage.getItem('dao_menh_profiles');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          const cleaned = list.map((p: any) => {
            const item = { ...p };
            if (item.name && item.name.toLowerCase().includes('đoàn')) {
              item.name = 'Nguyễn Văn An';
            }
            if (item.birthDate && (item.birthDate.includes('23/10/2000') || item.birthDate.includes('2000-10-23'))) {
              item.birthDate = '01/01/1990 01:00';
            }
            return item;
          });
          localStorage.setItem('dao_menh_profiles', JSON.stringify(cleaned));
          return cleaned;
        }
      } catch (e) {
        // fallback
      }
    }
    return [
      { id: 'sample-1', name: 'Nguyễn Văn An', birthDate: '01/01/1990 01:00', createdAt: '2026-10-21' }
    ];
  });

  const updateConfig = (newConfig: Partial<SystemConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('dao_menh_config', JSON.stringify(updated));
      return updated;
    });
  };

  const calculateAllCharts = (
    name: string,
    gender: 'male' | 'female',
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number = 0,
    school: LiuZhuSchool = config.defaultLiuZhuSchool
  ) => {
    // 1. Cập nhật profile đồng bộ toàn cục
    const updatedProfile: UserProfile = {
      fullName: name,
      gender,
      birthDate: `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      birthHour: hour,
      birthMinute: minute
    };
    setCurrentProfile(updatedProfile);
    localStorage.setItem('dao_menh_current_profile', JSON.stringify(updatedProfile));

    // 2. Tính toán lại Bát Tự, Lục Trụ & Tử Vi với dữ liệu chuẩn xác
    const bazi = generateBaziChart(name, gender, year, month, day, hour, minute);
    const liuzhu = generateLiuZhuChart(bazi, school, minute);
    const lunarDate = convertSolarToLunar(day, month, year);

    const canIdx = (lunarDate.year - 4) % 10;
    const chiIdx = (lunarDate.year - 4) % 12;
    const tuviYearCan = HEAVENLY_STEMS[(canIdx + 10) % 10].name;
    const tuviYearChi = EARTHLY_BRANCHES[(chiIdx + 12) % 12].name;

    const tuvi = generateTuViChart(
      name,
      gender,
      year,
      month,
      day,
      hour,
      lunarDate.day,
      lunarDate.month,
      tuviYearCan,
      tuviYearChi
    );

    setCurrentBaziChart(bazi);
    setCurrentLiuZhuChart(liuzhu);
    setCurrentTuViChart(tuvi);
  };

  const saveCurrentProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: currentBaziChart.profile.fullName,
      birthDate: `${currentBaziChart.profile.birthDate} ${currentBaziChart.profile.birthTime}`,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };
    const updated = [newProfile, ...savedProfiles];
    setSavedProfiles(updated);
    localStorage.setItem('dao_menh_profiles', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{
      config,
      updateConfig,
      activeTab,
      setActiveTab,
      currentProfile,
      currentBaziChart,
      currentLiuZhuChart,
      currentTuViChart,
      calculateAllCharts,
      savedProfiles,
      saveCurrentProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
