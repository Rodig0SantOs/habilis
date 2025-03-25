import { useNavigate } from "react-router";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/formulario");
  };

  return (
    <main className="container">
      <div className="content">
        <h1>
          <span class="highlight-1">CSIRT (Computer Security </span>
          <br />
          <span class="highlight-2">Incident Response Team) Habilis</span>
        </h1>
        <p className="paragraph">
          Canal para Denúncias de Incidentes Cibernéticos Relacionados a
          Habilis. <br />
          Presenciou ou tem conhecimento de um Incidente envolvendo a Habilis?{" "}
          <br />
          Clique no botão abaixo e preencha o formulário para registrar sua
          denúncia.
        </p>
        <button className="btn" onClick={handleClick}>
          Denunciar Incidente
        </button>
      </div>
    </main>
  );
}

export default App;
