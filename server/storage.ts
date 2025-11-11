import {
  type VoiceCommand,
  type InsertVoiceCommand,
  type UserSettings,
  type InsertUserSettings,
  type UpdateUserSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Voice Commands
  getCommands(): Promise<VoiceCommand[]>;
  getCommand(id: string): Promise<VoiceCommand | undefined>;
  createCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
  deleteAllCommands(): Promise<void>;

  // User Settings
  getSettings(): Promise<UserSettings | undefined>;
  createSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateSettings(settings: UpdateUserSettings): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private commands: Map<string, VoiceCommand>;
  private settings: UserSettings | undefined;

  constructor() {
    this.commands = new Map();
    this.settings = undefined;
  }

  // Voice Commands
  async getCommands(): Promise<VoiceCommand[]> {
    return Array.from(this.commands.values())
      .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
  }

  async getCommand(id: string): Promise<VoiceCommand | undefined> {
    return this.commands.get(id);
  }

  async createCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = randomUUID();
    const command: VoiceCommand = {
      ...insertCommand,
      id,
      executedAt: new Date(),
    };
    this.commands.set(id, command);
    return command;
  }

  async deleteAllCommands(): Promise<void> {
    this.commands.clear();
  }

  // User Settings
  async getSettings(): Promise<UserSettings | undefined> {
    return this.settings;
  }

  async createSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = {
      ...insertSettings,
      id,
    };
    this.settings = settings;
    return settings;
  }

  async updateSettings(updateSettings: UpdateUserSettings): Promise<UserSettings> {
    if (!this.settings) {
      // Create default settings if none exist
      this.settings = {
        id: randomUUID(),
        voiceSensitivity: "medium",
        wakeWordEnabled: false,
        language: "en-US",
        darkMode: false,
        highContrast: false,
      };
    }

    this.settings = {
      ...this.settings,
      ...updateSettings,
    };

    return this.settings;
  }
}

export const storage = new MemStorage();
