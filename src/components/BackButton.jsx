import Button from "./Button";
import { useNavigate } from "react-router-dom";

export function BackButton({backTo}) {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate( backTo || -1);
      }}
    >
      &larr; Back
    </Button>
  );
}
