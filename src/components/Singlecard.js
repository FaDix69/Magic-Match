import './Singlecard.css'



export default function  SingleCard({card, handleChoice, flipped }) {
    const handleClick =() => {
        handleChoice(card)
    }
    return (
        <div className="card">
            <div className={flipped ? "flipped" :""}>
              <img className="front" src={process.env.PUBLIC_URL + card.src} alt="card front" />
              <img className="back" 
              src="/img/cover.png" 
              onClick={handleClick}
              alt="card back" />
            </div>
          </div>
    )
}