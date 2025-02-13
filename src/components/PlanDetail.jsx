import React from 'react';

const PlanDetail = ({plan}) => {
    return (
        <div className='overflow-y-scroll py-4' style={{height: '80vh'}}>
            <div className='flex justify-between bg-gray-300 text-gray-700 font-semibold p-2'>
            <p>Dietary Preference: {plan.dietaryPreference}</p>
            <p>Calories: {plan.calories}</p>
            </div>
            <div className='mt-6 bg-gray-500 text-white text-center font-semibold'>
                <p>BreakFast</p>
            </div>
            <div className='grid grid-cols-3 gap-2 p-4'>
                {plan.breakfast.map((item, index) => (
                    <div key={index} className='bg-gray-200 rounded-md p-2'>
                        <img className='w-full h-24 rounded-lg' alt={item.name} src={item.imageUrl}/>
                        <p className='text-center font-semibold'>{item.name}</p>
                        <p>Calories: {item.calories}</p>
                        <p>Carbohydrates: {item.carbs}</p>
                        <p>Fats: {item.fat}</p>
                        <p>Protiens: {item.protein}</p>
                    </div>
                ))}
            </div>
            <div className='mt-6 bg-gray-500 text-white text-center font-semibold'>
                <p>Lunch</p>
            </div>
            <div className='grid grid-cols-3 gap-2 p-4'>
                {plan.lunch.map((item, index) => (
                    <div key={index} className='bg-gray-200 rounded-md p-2'>
                        <img className='w-full h-24 rounded-lg' alt={item.name} src={item.imageUrl}/>
                        <p className='text-center font-semibold'>{item.name}</p>
                        <p>Calories: {item.calories}</p>
                        <p>Carbohydrates: {item.carbs}</p>
                        <p>Fats: {item.fat}</p>
                        <p>Protiens: {item.protein}</p>
                    </div>
                ))}
            </div>
            <div className='mt-6 bg-gray-500 text-white text-center font-semibold'>
                <p>Dinner</p>
            </div>
            <div className='grid grid-cols-3 gap-2 p-4'>
                {plan.dinner.map((item, index) => (
                    <div key={index} className='bg-gray-200 rounded-md p-2'>
                        <img className='w-full h-24 rounded-lg' alt={item.name} src={item.imageUrl}/>
                        <p className='text-center font-semibold'>{item.name}</p>
                        <p>Calories: {item.calories}</p>
                        <p>Carbohydrates: {item.carbs}</p>
                        <p>Fats: {item.fat}</p>
                        <p>Protiens: {item.protein}</p>
                    </div>
                ))}
            </div>
            <div className='mt-6 bg-gray-500 text-white text-center font-semibold'>
                <p>Snacks</p>
            </div>
            <div className='grid grid-cols-3 gap-2 p-4'>
                {plan.snacks.map((item, index) => (
                    <div key={index} className='bg-gray-200 rounded-md p-2'>
                        <img className='w-full h-24 rounded-lg' alt={item.name} src={item.imageUrl}/>
                        <p className='text-center font-semibold'>{item.name}</p>
                        <p>Calories: {item.calories}</p>
                        <p>Carbohydrates: {item.carbs}</p>
                        <p>Fats: {item.fat}</p>
                        <p>Protiens: {item.protein}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanDetail;