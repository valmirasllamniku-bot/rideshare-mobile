type Projekt = {
  id: number;
  titulli: string;
  pershkrimi: string;
  lokacioni: string;
  cmimi: string;
  vende: number;
};

type Props = {
  projekt: Projekt;
};

export default function KartaUdhetimi({ projekt }: Props) {
  return (
    <div className="Karta">
      <h2>{projekt.titulli}</h2>
      <p>{projekt.pershkrimi}</p>
      <p><strong>Lokacioni:</strong> {projekt.lokacioni}</p>
      <p><strong>Çmimi:</strong> {projekt.cmimi}</p>

      {projekt.vende > 0 ? (
        <a href={`/projekti/${projekt.id}`} className="butoni">
          Shiko projektin
        </a>
      ) : (
        <button disabled>Nuk ka vende</button>
      )}
    </div>
  );
}