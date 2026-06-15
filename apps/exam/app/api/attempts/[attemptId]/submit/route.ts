import { NextResponse } from "next/server";
import { db } from "@seleksi/database";
import { getCurrentParticipant } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const participant = await getCurrentParticipant();
  if (!participant) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { attemptId } = await params;
  const attempt = await db.attempt.findFirst({
    where: { id: attemptId, examSession: { participantId: participant.id } },
    include: { questionSnapshots: true, examSession: true },
  });
  if (!attempt) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (attempt.status === "SUBMITTED") return NextResponse.json({ ok: true });
  if (attempt.status !== "ACTIVE" || attempt.examSession.status !== "ACTIVE") return NextResponse.json({ error: "ATTEMPT_NOT_ACTIVE" }, { status: 409 });
  if (!attempt.questionSnapshots.length) return NextResponse.json({ error: "EMPTY_ATTEMPT" }, { status: 409 });

  const correctCount = attempt.questionSnapshots.filter((item: any) => item.selectedLabel === item.answerKey).length;
  const unansweredCount = attempt.questionSnapshots.filter((item: any) => item.selectedLabel === null).length;
  const wrongCount = attempt.questionSnapshots.length - correctCount - unansweredCount;
  const rawScore = (correctCount / attempt.questionSnapshots.length) * 100;

  await db.$transaction([
    db.score.upsert({
      where: { attemptId: attempt.id },
      update: { correctCount, wrongCount, unansweredCount, rawScore, finalScore: rawScore, calculatedAt: new Date() },
      create: { attemptId: attempt.id, correctCount, wrongCount, unansweredCount, rawScore, finalScore: rawScore },
    }),
    db.attempt.update({
      where: { id: attempt.id },
      data: { status: "SUBMITTED", submittedAt: new Date(), lastSavedAt: new Date() },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
