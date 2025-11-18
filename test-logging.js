/**
 * Test the Logging System
 * Simple test to verify logging functionality
 */

import {
  initializeLogging,
  log,
  modules,
  createContext,
  runWithContext,
  agentContext,
  performanceContext
} from './src/logger/index.js';

async function testLogging() {
  console.log('=== Testing Winston Logging System ===\n');

  // 1. Initialize logging
  console.log('1. Initializing logging system...');
  await initializeLogging({
    level: 'debug',
    enableMetrics: true,
    metricsInterval: 5000,
    globalContext: {
      appVersion: '1.0.0',
      environment: 'test'
    }
  });
  console.log('✓ Logging initialized\n');

  // 2. Test basic logging levels
  console.log('2. Testing logging levels...');
  log.error('This is an error message');
  log.warn('This is a warning message');
  log.info('This is an info message');
  log.debug('This is a debug message');
  console.log('✓ Basic logging tested\n');

  // 3. Test contextual logging
  console.log('3. Testing contextual logging...');
  const context = createContext({
    userId: 'user-123',
    requestId: 'req-456'
  });

  await runWithContext(context, () => {
    log.info('Message with context', {
      action: 'test',
      value: 42
    });
  });
  console.log('✓ Contextual logging tested\n');

  // 4. Test module loggers
  console.log('4. Testing module loggers...');

  // Agent logger
  modules.agent.logInit('test-agent-1', {
    type: 'test',
    capabilities: ['testing'],
    version: '1.0.0'
  });

  modules.agent.logTaskStart('test-agent-1', 'task-001', 'test');

  // RabbitMQ logger
  modules.mq.logConnection('connected', 'amqp://localhost', {
    vhost: '/',
    heartbeat: 60
  });

  // Voting logger
  modules.voting.logSessionStart('session-001', 'Test Vote', ['agent-1', 'agent-2'], {
    type: 'consensus',
    threshold: 0.6
  });

  // Gamification logger
  modules.gamification.logAchievement('user-123', {
    id: 'first-task',
    name: 'First Task Completed',
    points: 100,
    rarity: 'common'
  });

  console.log('✓ Module loggers tested\n');

  // 5. Test performance logging
  console.log('5. Testing performance logging...');

  // Using timer
  log.time('test-operation');
  await new Promise(resolve => setTimeout(resolve, 100));
  const duration = log.timeEnd('test-operation', { result: 'success' });
  console.log(`✓ Timer logged operation: ${duration}ms\n`);

  // Using performance context
  await performanceContext('database-query', async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    log.info('Query executed');
  });
  console.log('✓ Performance context tested\n');

  // 6. Test agent context
  console.log('6. Testing agent context...');
  await agentContext('test-agent-1', 'task-002', async (context) => {
    log.info('Processing in agent context', {
      step: 'validation'
    });
    await new Promise(resolve => setTimeout(resolve, 30));
    return { success: true };
  });
  console.log('✓ Agent context tested\n');

  // 7. Test error logging
  console.log('7. Testing error logging...');
  const testError = new Error('Test error message');
  testError.code = 'TEST_ERROR';
  log.exception(testError, 'Testing error handler', {
    testData: 'some value'
  });
  console.log('✓ Error logging tested\n');

  // 8. Test audit logging
  console.log('8. Testing audit logging...');
  log.audit('USER_LOGIN', 'user-123', {
    ip: '192.168.1.1',
    userAgent: 'TestClient/1.0',
    success: true
  });
  console.log('✓ Audit logging tested\n');

  // 9. Test child logger
  console.log('9. Testing child logger...');
  const childLogger = log.child('test-module', {
    version: '1.0.0'
  });
  childLogger.info('Message from child logger');
  console.log('✓ Child logger tested\n');

  // 10. Check debug mode
  console.log('10. Checking debug mode...');
  console.log(`Debug enabled: ${log.isDebugEnabled}`);
  console.log('✓ Debug mode checked\n');

  // Give some time for async logs to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('=== All tests completed successfully! ===\n');
  console.log('Check the following locations for logs:');
  console.log('  - Console output (development format)');
  console.log('  - logs/combined-*.log (JSON format)');
  console.log('  - logs/error-*.log (errors only)');
  console.log('  - logs/debug-*.log (debug level)');
  console.log('  - logs/performance.log (performance metrics)\n');

  // Shutdown logging
  await log.close();
  console.log('Logging system shut down gracefully.\n');
}

// Run tests
testLogging()
  .then(() => {
    console.log('Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });