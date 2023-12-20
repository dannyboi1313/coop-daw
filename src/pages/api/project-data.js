import { data } from "../../../data/dummydata";

export default function handler(req, res) {
  res.status(200).json(data);
}
