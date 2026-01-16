import { questionCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answerId } = await request.json();

    const question = await databases.getDocument(
      db,
      questionCollection,
      questionId
    );

    // Update the question with the bestAnswerId
    const response = await databases.updateDocument(
      db,
      questionCollection,
      questionId,
      {
        bestAnswerId: answerId,
      }
    );

    // Increase answer author reputation
    const answer = await databases.getDocument(db, "answers", answerId); // using hardcoded "answers" or importing answerCollection
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error marking answer as solved",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
