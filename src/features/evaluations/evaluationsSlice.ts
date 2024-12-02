import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Evaluation } from "../../models/Evaluation";

interface EvaluationState {
    evaluations: Evaluation[];
}

const initialState: EvaluationState = {
    evaluations: [],
};

const evaluationsSlice = createSlice({
    name: "evaluations",
    initialState,
    reducers: {
        addEvaluation(state, action: PayloadAction<Evaluation>) {
            state.evaluations.push(action.payload);
        },
        updateEvaluation(state, action: PayloadAction<Evaluation>) {
            const index = state.evaluations.findIndex(
                (e) => e.reservationId === action.payload.reservationId
            );
            if (index >= 0) {
                state.evaluations[index] = action.payload;
            }
        },
        removeEvaluation(state, action: PayloadAction<number>) {
            state.evaluations = state.evaluations.filter(
                (e) => e.reservationId !== action.payload
            );
        },
    },
});

export const { addEvaluation, updateEvaluation, removeEvaluation } = evaluationsSlice.actions;
export default evaluationsSlice.reducer;