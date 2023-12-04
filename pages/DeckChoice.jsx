import React from 'react'
import Card from './Card';
import Hand from './Hand';

const DeckChoice = () => {


    

  return (

    <div className='boardgame h-screen bg-[#121212] text-white container justify-center items-center'>
        <div className='flex flex-row justify-center items-center'>

            <Hand />

        </div>
    </div>

  )
};

export default DeckChoice;

/*
<Card rank="ba" suit="ck" />

            <Card value="Ace"  />
            <Card value="King" />
            <Card value="Queen" />
            <Card value="Jack" />
        
            
            <Card value="Back" />
            <Card value="Back" />
            <Card value="Back" />
            <Card value="Back" />

*/