import React from 'react'

const Rules = () => {
  return (

        <div className='max-w-screen-xl'>

        <React.Fragment>
            <span align="center" className="textrules"><dd>
            Chacun des 4 joueurs doit effectuer <b>7 contrats</b>.<br></br>
            Celui qui démarre est désigné par le tirage au sort.<br></br>
            La carte la plus forte commence à faire ses contrats.<br></br>
            Celui qui effectue ses contrats apparaît en <span className="text-red-500">ROUGE</span>.<br></br>
            </dd></span><br></br>
        </React.Fragment>

        <table>
        <tbody>
        <tr>
        <React.Fragment>

            <th align='center'>
                <span className="text-xl"><h5>DERNIER PLI 🎖</h5></span>
                <span className="textrules">
                Celui qui récupère le <b>DERNIER PLI</b> perd <b><span className="text-red-500">25 points</span></b>.<br></br><br></br>
                </span>

                <span className="text-xl"><h5>PLIS 🀄️</h5></span>
                <span className="textrules">
                Vous perdrez <b><span className="text-red-500">5 points</span></b> pour chaque pli récupéré.<br></br>
                Celui qui récupère <b>TOUS LES PLIS</b> gagne <b><span className="text-green-500">+40 points</span></b>.<br></br><br></br>
                </span>

                <span className="text-xl"><h5>COEURS ♥️</h5></span>
                <span className="textrules">
                Vous perdrez <b><span className="text-red-500">5 points</span></b> pour chaque ♥️ contenu dans vos plis.<br></br>
                Celui qui récupère <b>TOUS LES COEURS</b> gagne <b><span className="text-green-500">+40 points</span></b>.<br></br><br></br>
                </span>

                <span className="text-xl"><h5>DAMES 👸🏽</h5></span>

                <span className="textrules">
                Vous perdrez <b><span className="text-red-500">10 points</span></b> par dame contenue dans vos plis.<br></br>
                Celui qui récupère <b>TOUTES LES DAMES</b> gagne <b><span className="text-green-500">+40 points</span></b>.<br></br><br></br>
                </span>
                
        { /*  </th>

  <th align='center' className='px-4'> */ } 

                <span className="text-xl"><h5>BARBU 🎅🏾</h5></span>
                <span className="textrules">Celui qui récupère le Barbu (<b>Roi de ♥️</b>) perd <b><span className="crr">40 points</span></b>.<br></br><br></br></span>
                
                <span className="text-xl"><h5>DOMINO 🎲</h5></span>
                <span className="textrules">

                C&apos;est le même principe que le jeu du Domino classic.<br></br>
                On commence <b>OBLIGATOIREMENT</b> par un <b>Valet</b>.<br></br>
                Il va falloir poser les cartes <b>dans l&apos;ordre de leur valeur</b>.<br></br>
                <i>Exemple</i> : (A.R.D.<span className="text-blue-500">V</span>.10.9.8.7)<br></br>
                Celui qui n&apos;a plus de cartes en main gagne le Domino.<br></br>
                <b>1er : <span className="text-green-500">+50 points</span> ➡️ 2e : <span className="text-blue-500">+25 points</span> ➡️ 3e : 0 point ➡️ 4e : <span className="text-red-500">-25 points</span></b><br></br><br></br>
                
                </span>
                
                <span className="text-xl"><h5>RATA 🔥</h5></span>
                <span className="textrules">

                La RATA rassemble <b>TOUS LES CONTRATS</b> sauf le Domino.<br></br>
                Celui qui récupère <b>TOUS LES PLIS</b> de la RATA<br></br>
                gagne <b><span className="text-green-500">+185 points</span></b>.<br></br><br></br>
                </span>

            </th>
                
            </React.Fragment>
        </tr>
        </tbody>
        </table>


        <React.Fragment>
            <span align="center" className="textrules">
                <dd>Au bout des <b>28 contrats</b>, le score <b>le plus élevé</b> gagne la partie!</dd>
            </span>    
        </React.Fragment>

    </div>
  )
}

export default Rules;