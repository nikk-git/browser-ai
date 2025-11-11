import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Voice commands table
export const voiceCommands = pgTable("voice_commands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transcript: text("transcript").notNull(),
  intent: text("intent").notNull(),
  confidence: text("confidence"),
  executedAt: timestamp("executed_at").notNull().defaultNow(),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voiceSensitivity: text("voice_sensitivity").notNull().default("medium"),
  wakeWordEnabled: boolean("wake_word_enabled").notNull().default(false),
  language: text("language").notNull().default("en-US"),
  darkMode: boolean("dark_mode").notNull().default(false),
  highContrast: boolean("high_contrast").notNull().default(false),
});

// Insert schemas
export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({
  id: true,
  executedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export const updateUserSettingsSchema = insertUserSettingsSchema.partial();

// Types
export type VoiceCommand = typeof voiceCommands.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;

// Available commands configuration
export interface CommandDefinition {
  id: string;
  name: string;
  phrases: string[];
  icon: string;
  category: string;
  action: string;
}

export const availableCommands: CommandDefinition[] = [
  {
    id: "navigate-home",
    name: "Go Home",
    phrases: ["go home", "home page", "navigate home"],
    icon: "home",
    category: "navigation",
    action: "navigate:/",
  },
  {
    id: "navigate-settings",
    name: "Open Settings",
    phrases: ["open settings", "settings", "preferences"],
    icon: "settings",
    category: "navigation",
    action: "navigate:/settings",
  },
  {
    id: "clear-history",
    name: "Clear History",
    phrases: ["clear history", "delete history", "remove history"],
    icon: "delete_sweep",
    category: "action",
    action: "clear-history",
  },
  {
    id: "toggle-dark-mode",
    name: "Toggle Dark Mode",
    phrases: ["dark mode", "light mode", "toggle theme"],
    icon: "dark_mode",
    category: "action",
    action: "toggle-dark-mode",
  },
  {
    id: "help",
    name: "Show Help",
    phrases: ["help", "show commands", "what can I say"],
    icon: "help",
    category: "utility",
    action: "show-help",
  },
  {
    id: "stop-listening",
    name: "Stop Listening",
    phrases: ["stop listening", "stop", "cancel"],
    icon: "mic_off",
    category: "control",
    action: "stop-listening",
  },
];
