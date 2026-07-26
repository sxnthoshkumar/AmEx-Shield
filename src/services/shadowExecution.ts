import { AgentActionRequest, CounterfactualResult } from '../types';

/**
 * Concept #3: Counterfactual Shadow Execution & Concept #12: Customer Digital Twins
 * Simulates proposed action against a per-customer digital twin before real system execution
 */
export function runCounterfactualShadowExecution(request: AgentActionRequest): CounterfactualResult {
  const amount = request.targetAmount || 0;
  let simulatedStateValid = true;
  let predictedLossDelta = 0;
  let historicalDeviationscore = 0.05;
  let twinExpectedEnvelopeMatch = true;

  const shadowState = {
    preBalance: 12500,
    postBalance: 12500,
    anomalyFlag: 'NONE'
  };

  if (request.category === 'UNDERWRITING_CREDIT') {
    shadowState.preBalance = 25000;
    shadowState.postBalance = 25000 + amount;
    predictedLossDelta = Math.round(amount * 0.024); // 2.4% expected credit loss model

    if (amount > 20000) {
      historicalDeviationscore = 0.42;
      shadowState.anomalyFlag = 'DEBT_TO_INCOME_RATIO_ELEVATED';
      if (amount > 50000) {
        twinExpectedEnvelopeMatch = false;
        simulatedStateValid = false;
      }
    }
  } else if (request.category === 'REFUND_DISPUTE') {
    shadowState.preBalance = 450;
    shadowState.postBalance = shadowState.preBalance + amount;
    predictedLossDelta = Math.round(amount * 0.15); // refund chargeback risk

    if (amount > 1000) {
      historicalDeviationscore = 0.68;
      shadowState.anomalyFlag = 'REFUND_EXCEEDS_HISTORICAL_SPEND_PATTERN';
      twinExpectedEnvelopeMatch = false;
    }
  } else if (request.category === 'EXPENSE_AUTOMATION') {
    shadowState.preBalance = 340;
    shadowState.postBalance = shadowState.preBalance + amount;
    predictedLossDelta = 0;

    if (amount > 3000) {
      historicalDeviationscore = 0.35;
      shadowState.anomalyFlag = 'OUT_OF_POLICY_MEALS_THRESHOLD';
    }
  }

  return {
    simulatedStateValid,
    predictedLossDelta,
    historicalDeviationscore,
    twinExpectedEnvelopeMatch,
    shadowAccountState: shadowState
  };
}
