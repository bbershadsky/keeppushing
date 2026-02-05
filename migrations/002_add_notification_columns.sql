-- Migration: Add notification columns to user_challenges table
-- Run this if you already have the table created

ALTER TABLE user_challenges 
ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_time TIME NOT NULL DEFAULT '12:00:00';
