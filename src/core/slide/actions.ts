import { createStandardAction } from "typesafe-actions";

const NEXT_SLIDE = "NEXT_SLIDE";

export const nextSlide = createStandardAction(NEXT_SLIDE)<{ image: string }>();
