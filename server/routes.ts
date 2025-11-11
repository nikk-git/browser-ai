import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoiceCommandSchema, updateUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Voice Commands Routes
  
  // GET /api/commands - Get all voice commands
  app.get("/api/commands", async (req, res) => {
    try {
      const commands = await storage.getCommands();
      res.json(commands);
    } catch (error) {
      console.error("Error fetching commands:", error);
      res.status(500).json({ error: "Failed to fetch commands" });
    }
  });

  // POST /api/commands - Create a new voice command
  app.post("/api/commands", async (req, res) => {
    try {
      const validatedData = insertVoiceCommandSchema.parse(req.body);
      const command = await storage.createCommand(validatedData);
      res.status(201).json(command);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid command data", details: error.errors });
      } else {
        console.error("Error creating command:", error);
        res.status(500).json({ error: "Failed to create command" });
      }
    }
  });

  // DELETE /api/commands - Clear all command history
  app.delete("/api/commands", async (req, res) => {
    try {
      await storage.deleteAllCommands();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting commands:", error);
      res.status(500).json({ error: "Failed to delete commands" });
    }
  });

  // User Settings Routes
  
  // GET /api/settings - Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      let settings = await storage.getSettings();
      
      // If no settings exist, create default ones
      if (!settings) {
        settings = await storage.createSettings({
          voiceSensitivity: "medium",
          wakeWordEnabled: false,
          language: "en-US",
          darkMode: false,
          highContrast: false,
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // PATCH /api/settings - Update user settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = updateUserSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid settings data", details: error.errors });
      } else {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
