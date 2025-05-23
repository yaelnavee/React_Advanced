import { useParams } from "react-router-dom";
function Todos() {
    const { userId } = useParams();

  return (
    <>todos will be here</>
  );
}

export default Todos;