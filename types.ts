
import React from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agi' | 'system';
  timestamp: Date;
  avatar: React.ReactNode;
  isLoading?: boolean;
}

// Define parts of the AGI schema for context, if needed for more complex interactions later.
// For now, these are not directly used in rendering but show how schema types could be structured.
export interface AgiPrimaryOrchestrator {
  agent_name: string;
  role: string;
  operational_state_metaphor: string;
}

export interface AgiCorePhilosophy {
  primary_virtue: string;
  decision_making_principle: { name: string };
  foundational_truth: { name: string };
  highest_wisdom: { name: string };
}

export interface AgiSchema {
  title: string;
  version: string;
  primary_orchestrator: AgiPrimaryOrchestrator;
  core_guiding_philosophy: AgiCorePhilosophy;
  // Add other parts of the schema as needed
}
