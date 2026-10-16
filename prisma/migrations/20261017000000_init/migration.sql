-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'operator', 'general');

-- CreateEnum
CREATE TYPE "ChallengePurpose" AS ENUM ('registration', 'authentication');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('game', 'practice');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('official', 'practice', 'undecided');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('win', 'lose', 'draw');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('pitcher', 'catcher', 'first', 'second', 'third', 'shortstop', 'left', 'center', 'right', 'dh');

-- CreateEnum
CREATE TYPE "Hand" AS ENUM ('right', 'left', 'both');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('starting', 'bench');

-- CreateEnum
CREATE TYPE "MemberCategory" AS ENUM ('regular', 'guest');

-- CreateEnum
CREATE TYPE "AtBatResult" AS ENUM ('single', 'double', 'triple', 'homeRun', 'walk', 'hitByPitch', 'strikeout', 'groundOut', 'flyOut', 'lineOut', 'sacrificeHit', 'sacrificeFly', 'fieldersChoice', 'doublePlay', 'error');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('sunny', 'cloudy', 'rainy', 'snowy');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "transports" TEXT[],
    "backedUp" BOOLEAN NOT NULL,
    "name" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebAuthnChallenge" (
    "id" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "purpose" "ChallengePurpose" NOT NULL,
    "userId" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebAuthnChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "season" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ground" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "access" TEXT,
    "url" TEXT NOT NULL,
    "imagePath" TEXT,
    "mapEmbedUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opponent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "uniformNumber" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "subPositions" "Position"[],
    "throwHand" "Hand" NOT NULL,
    "batHand" "Hand" NOT NULL,
    "category" "MemberCategory" NOT NULL DEFAULT 'regular',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'scheduled',
    "note" TEXT,
    "cancelReason" TEXT,
    "seasonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Practice" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "groundId" INTEGER,
    "groundCourt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeMember" (
    "id" SERIAL NOT NULL,
    "practiceId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL DEFAULT 1,
    "gameType" "GameType" NOT NULL DEFAULT 'undecided',
    "isFirstBatting" BOOLEAN,
    "leagueId" INTEGER,
    "groundId" INTEGER,
    "groundCourt" TEXT,
    "opponentId" INTEGER,
    "teamScore" INTEGER,
    "opponentScore" INTEGER,
    "teamHits" INTEGER,
    "opponentHits" INTEGER,
    "teamErrors" INTEGER,
    "opponentErrors" INTEGER,
    "teamForfeitedRuns" INTEGER,
    "opponentForfeitedRuns" INTEGER,
    "result" "GameResult",
    "summary" TEXT,
    "aiGoodPoints" TEXT,
    "aiBadPoints" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameParticipant" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMvp" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameWeather" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "weather" "Weather" NOT NULL,
    "temperature" DOUBLE PRECISION,

    CONSTRAINT "GameWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inning" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "inningNumber" INTEGER NOT NULL,
    "teamScore" INTEGER NOT NULL DEFAULT 0,
    "opponentScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMember" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "battingOrder" INTEGER,
    "position" "Position",
    "stolenBases" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchingResult" (
    "id" SERIAL NOT NULL,
    "gameMemberId" INTEGER NOT NULL,
    "pitchingOrder" INTEGER NOT NULL DEFAULT 1,
    "inningsPitched" INTEGER NOT NULL DEFAULT 0,
    "partialOuts" INTEGER,
    "earnedRuns" INTEGER NOT NULL DEFAULT 0,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "strikeouts" INTEGER NOT NULL DEFAULT 0,
    "walks" INTEGER NOT NULL DEFAULT 0,
    "hitByPitches" INTEGER NOT NULL DEFAULT 0,
    "hitsAllowed" INTEGER NOT NULL DEFAULT 0,
    "homeRunsAllowed" INTEGER NOT NULL DEFAULT 0,
    "pitchCount" INTEGER,
    "isResponsible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PitchingResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlateAppearance" (
    "id" SERIAL NOT NULL,
    "gameMemberId" INTEGER NOT NULL,
    "inningNumber" INTEGER NOT NULL,
    "atBatInGame" INTEGER NOT NULL,
    "result" "AtBatResult" NOT NULL,
    "direction" "Position",
    "rbi" INTEGER NOT NULL DEFAULT 0,
    "isScoringPosition" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlateAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Passkey_userId_idx" ON "Passkey"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "Invitation_userId_idx" ON "Invitation"("userId");

-- CreateIndex
CREATE INDEX "WebAuthnChallenge_expiresAt_idx" ON "WebAuthnChallenge"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Season_season_key" ON "Season"("season");

-- CreateIndex
CREATE UNIQUE INDEX "League_name_key" ON "League"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Opponent_name_key" ON "Opponent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Event_seasonId_date_idx" ON "Event"("seasonId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Practice_eventId_key" ON "Practice"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeMember_practiceId_memberId_key" ON "PracticeMember"("practiceId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_eventId_key" ON "Game"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "GameParticipant_gameId_memberId_key" ON "GameParticipant"("gameId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GameMvp_gameId_memberId_key" ON "GameMvp"("gameId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GameMvp_gameId_order_key" ON "GameMvp"("gameId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "GameWeather_gameId_key" ON "GameWeather"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Inning_gameId_inningNumber_key" ON "Inning"("gameId", "inningNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GameMember_gameId_memberId_key" ON "GameMember"("gameId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PitchingResult_gameMemberId_key" ON "PitchingResult"("gameMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "PlateAppearance_gameMemberId_atBatInGame_key" ON "PlateAppearance"("gameMemberId", "atBatInGame");

-- AddForeignKey
ALTER TABLE "Passkey" ADD CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeMember" ADD CONSTRAINT "PracticeMember_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeMember" ADD CONSTRAINT "PracticeMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMvp" ADD CONSTRAINT "GameMvp_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMvp" ADD CONSTRAINT "GameMvp_gameId_memberId_fkey" FOREIGN KEY ("gameId", "memberId") REFERENCES "GameParticipant"("gameId", "memberId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameWeather" ADD CONSTRAINT "GameWeather_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inning" ADD CONSTRAINT "Inning_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMember" ADD CONSTRAINT "GameMember_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMember" ADD CONSTRAINT "GameMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchingResult" ADD CONSTRAINT "PitchingResult_gameMemberId_fkey" FOREIGN KEY ("gameMemberId") REFERENCES "GameMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateAppearance" ADD CONSTRAINT "PlateAppearance_gameMemberId_fkey" FOREIGN KEY ("gameMemberId") REFERENCES "GameMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

