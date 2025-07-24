import { Schema, model } from "mongoose";
import { University } from "../types/types";

const uniSchema = new Schema<University>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    city: { type: String, require: true },
    overview: { type: String, require: true },
    ranking: { type: String, require: true },
    tuition: { type: String, require: true },
    scholarship: { type: String, require: true },
    type: { type: String, require: true },
    website: { type: String, require: true },
});

const Universities = model<University>('universities', uniSchema);

export default Universities;