export default function Card({ name, image, onClick }) {
  return (
    <div onClick={onClick} className="card p-1 sm:p-2 md:p-3">
      <img src={image} alt={name} className="card-image" />
      <p className="card-name">{name}</p>
    </div>
  );
}
