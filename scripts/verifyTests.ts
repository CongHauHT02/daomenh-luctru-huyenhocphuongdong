// CLI Test runner
import { runAllMetaphysicsTests } from '../src/engine/testRunner.ts';

const res = runAllMetaphysicsTests();
console.log('====================================');
console.log(`TOTAL TESTS: ${res.total}`);
console.log(`PASSED: ${res.passedCount}`);
console.log(`FAILED: ${res.failedCount}`);
console.log('====================================');
res.results.forEach(t => {
  console.log(`[${t.passed ? 'PASS' : 'FAIL'}] ${t.name}`);
  if (!t.passed) {
    console.log(`   Expected:`, t.expected);
    console.log(`   Actual:`, t.actual);
  }
});
if (res.failedCount > 0) process.exit(1);
