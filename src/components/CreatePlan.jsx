import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';

const schema = yup.object().shape({
  dietaryPreference: yup.string().required('Dietary Preference is required'),
  calories: yup.number().required('Calories are required').min(0, 'Calories must be at least 0'),
  breakfast: yup.array().of(
    yup.object().shape({
      calories: yup.number().required('Calories are required').min(0, 'Calories must be at least 0'),
      carbs: yup.string().required('Carbs are required'),
      fat: yup.string().required('Fat is required'),
      imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
      name: yup.string().required('Name is required'),
      protein: yup.string().required('Protein is required'),
    })
  ).min(1, 'At least one breakfast item is required'),
  lunch: yup.array().of(
    yup.object().shape({
      calories: yup.number().required('Calories are required').min(0, 'Calories must be at least 0'),
      carbs: yup.string().required('Carbs are required'),
      fat: yup.string().required('Fat is required'),
      imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
      name: yup.string().required('Name is required'),
      protein: yup.string().required('Protein is required'),
    })
  ).min(1, 'At least one lunch item is required'),
  dinner: yup.array().of(
    yup.object().shape({
      calories: yup.number().required('Calories are required').min(0, 'Calories must be at least 0'),
      carbs: yup.string().required('Carbs are required'),
      fat: yup.string().required('Fat is required'),
      imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
      name: yup.string().required('Name is required'),
      protein: yup.string().required('Protein is required'),
    })
  ).min(1, 'At least one dinner item is required'),
  snacks: yup.array().of(
    yup.object().shape({
      calories: yup.number().required('Calories are required').min(0, 'Calories must be at least 0'),
      carbs: yup.string().required('Carbs are required'),
      fat: yup.string().required('Fat is required'),
      imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
      name: yup.string().required('Name is required'),
      protein: yup.string().required('Protein is required'),
    })
  ).min(1, 'At least one snack item is required'),
});

const CreatePlan = ({ onClose }) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dietaryPreference: '',
      calories: 0,
      breakfast: [{}],
      lunch: [{}],
      dinner: [{}],
      snacks: [{}],
    }
  });

  const { fields: breakfastFields, append: appendBreakfast, remove: removeBreakfast } = useFieldArray({
    control,
    name: 'breakfast'
  });

  const { fields: lunchFields, append: appendLunch, remove: removeLunch } = useFieldArray({
    control,
    name: 'lunch'
  });

  const { fields: dinnerFields, append: appendDinner, remove: removeDinner } = useFieldArray({
    control,
    name: 'dinner'
  });

  const { fields: snacksFields, append: appendSnacks, remove: removeSnacks } = useFieldArray({
    control,
    name: 'snacks'
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "dietPlans"), data);
      toast.success('Plan created successfully');
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating plan:", error);
      toast.error('Failed to create plan');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 p-2 overflow-y-scroll" style={{ height: '80vh' }}>
      <div>
        <label className="block text-gray-700">Dietary Preference</label>
        <input
          type="text"
          {...register('dietaryPreference')}
          className="w-full px-3 py-1 border rounded-md"
        />
        {errors.dietaryPreference && <p className="text-red-500">{errors.dietaryPreference.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Calories</label>
        <input
          type="number"
          {...register('calories')}
          className="w-full px-3 py-1 border rounded-md"
        />
        {errors.calories && <p className="text-red-500">{errors.calories.message}</p>}
      </div>

      <div className="col-span-2">
        <h3 className="text-xl text-center bg-gray-500 mb-4 text-white font-semibold py-1">Breakfast</h3>
        {breakfastFields.map((item, index) => (
          <div key={item.id} className='flex flex-row-reverse bg-gray-100 mb-2 p-3 rounded-md'>
            {breakfastFields.length > 1 && (
              <div className="flex justify-end -mr-2 -mt-4">
                <button
                  type="button"
                  onClick={() => removeBreakfast(index)}
                  className="mt-2 text-gray-500 py-1 rounded-md text-xl h-fit hover:text-red-700"
                >
                  <IoClose/>
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  {...register(`breakfast.${index}.name`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.breakfast?.[index]?.name && <p className="text-red-500">{errors.breakfast[index].name.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  {...register(`breakfast.${index}.imageUrl`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.breakfast?.[index]?.imageUrl && <p className="text-red-500">{errors.breakfast[index].imageUrl.message}</p>}
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-gray-700">Calories</label>
                  <input
                    type="number"
                    {...register(`breakfast.${index}.calories`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.breakfast?.[index]?.calories && <p className="text-red-500">{errors.breakfast[index].calories.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Carbs</label>
                  <input
                    type="text"
                    {...register(`breakfast.${index}.carbs`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.breakfast?.[index]?.carbs && <p className="text-red-500">{errors.breakfast[index].carbs.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Fat</label>
                  <input
                    type="text"
                    {...register(`breakfast.${index}.fat`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.breakfast?.[index]?.fat && <p className="text-red-500">{errors.breakfast[index].fat.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Protein</label>
                  <input
                    type="text"
                    {...register(`breakfast.${index}.protein`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.breakfast?.[index]?.protein && <p className="text-red-500">{errors.breakfast[index].protein.message}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => appendBreakfast({})}
            className="mt-2 bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-900"
          >
            <FaPlus/>
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="text-xl text-center bg-gray-500 mb-4 text-white font-semibold py-1">Lunch</h3>
        {lunchFields.map((item, index) => (
          <div key={item.id} className='flex flex-row-reverse bg-gray-100 mb-2 p-3 rounded-md'>
            {lunchFields.length > 1 && (
              <div className="flex justify-end -mr-2 -mt-4">
                <button
                  type="button"
                  onClick={() => removeLunch(index)}
                  className="mt-2 text-gray-500 py-1 rounded-md text-xl h-fit hover:text-red-700"
                >
                  <IoClose/>
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  {...register(`lunch.${index}.name`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.lunch?.[index]?.name && <p className="text-red-500">{errors.lunch[index].name.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  {...register(`lunch.${index}.imageUrl`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.lunch?.[index]?.imageUrl && <p className="text-red-500">{errors.lunch[index].imageUrl.message}</p>}
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-gray-700">Calories</label>
                  <input
                    type="number"
                    {...register(`lunch.${index}.calories`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.lunch?.[index]?.calories && <p className="text-red-500">{errors.lunch[index].calories.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Carbs</label>
                  <input
                    type="text"
                    {...register(`lunch.${index}.carbs`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.lunch?.[index]?.carbs && <p className="text-red-500">{errors.lunch[index].carbs.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Fat</label>
                  <input
                    type="text"
                    {...register(`lunch.${index}.fat`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.lunch?.[index]?.fat && <p className="text-red-500">{errors.lunch[index].fat.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Protein</label>
                  <input
                    type="text"
                    {...register(`lunch.${index}.protein`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.lunch?.[index]?.protein && <p className="text-red-500">{errors.lunch[index].protein.message}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => appendLunch({})}
            className="mt-2 bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-900"
          >
            <FaPlus/>
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="text-xl text-center bg-gray-500 mb-4 text-white font-semibold py-1">Dinner</h3>
        {dinnerFields.map((item, index) => (
          <div key={item.id} className='flex flex-row-reverse bg-gray-100 mb-2 p-3 rounded-md'>
            {dinnerFields.length > 1 && (
              <div className="flex justify-end -mr-2 -mt-4">
                <button
                  type="button"
                  onClick={() => removeDinner(index)}
                  className="mt-2 text-gray-500 py-1 rounded-md text-xl h-fit hover:text-red-700"
                >
                  <IoClose/>
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  {...register(`dinner.${index}.name`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.dinner?.[index]?.name && <p className="text-red-500">{errors.dinner[index].name.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  {...register(`dinner.${index}.imageUrl`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.dinner?.[index]?.imageUrl && <p className="text-red-500">{errors.dinner[index].imageUrl.message}</p>}
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-gray-700">Calories</label>
                  <input
                    type="number"
                    {...register(`dinner.${index}.calories`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.dinner?.[index]?.calories && <p className="text-red-500">{errors.dinner[index].calories.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Carbs</label>
                  <input
                    type="text"
                    {...register(`dinner.${index}.carbs`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.dinner?.[index]?.carbs && <p className="text-red-500">{errors.dinner[index].carbs.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Fat</label>
                  <input
                    type="text"
                    {...register(`dinner.${index}.fat`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.dinner?.[index]?.fat && <p className="text-red-500">{errors.dinner[index].fat.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Protein</label>
                  <input
                    type="text"
                    {...register(`dinner.${index}.protein`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.dinner?.[index]?.protein && <p className="text-red-500">{errors.dinner[index].protein.message}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => appendDinner({})}
            className="mt-2 bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-900"
          >
            <FaPlus/>
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="text-xl text-center bg-gray-500 mb-4 text-white font-semibold py-1">Snacks</h3>
        {snacksFields.map((item, index) => (
          <div key={item.id} className='flex flex-row-reverse bg-gray-100 mb-2 p-3 rounded-md'>
            {snacksFields.length > 1 && (
              <div className="flex justify-end -mr-2 -mt-4">
                <button
                  type="button"
                  onClick={() => removeSnacks(index)}
                  className="mt-2 text-gray-500 py-1 rounded-md text-xl h-fit hover:text-red-700"
                >
                  <IoClose/>
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  {...register(`snacks.${index}.name`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.snacks?.[index]?.name && <p className="text-red-500">{errors.snacks[index].name.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  {...register(`snacks.${index}.imageUrl`)}
                  className="w-full px-3 py-1 border rounded-md"
                />
                {errors.snacks?.[index]?.imageUrl && <p className="text-red-500">{errors.snacks[index].imageUrl.message}</p>}
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-gray-700">Calories</label>
                  <input
                    type="number"
                    {...register(`snacks.${index}.calories`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.snacks?.[index]?.calories && <p className="text-red-500">{errors.snacks[index].calories.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Carbs</label>
                  <input
                    type="text"
                    {...register(`snacks.${index}.carbs`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.snacks?.[index]?.carbs && <p className="text-red-500">{errors.snacks[index].carbs.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Fat</label>
                  <input
                    type="text"
                    {...register(`snacks.${index}.fat`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.snacks?.[index]?.fat && <p className="text-red-500">{errors.snacks[index].fat.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-700">Protein</label>
                  <input
                    type="text"
                    {...register(`snacks.${index}.protein`)}
                    className="w-full px-3 py-1 border rounded-md"
                  />
                  {errors.snacks?.[index]?.protein && <p className="text-red-500">{errors.snacks[index].protein.message}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => appendSnacks({})}
            className="mt-2 bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-900"
          >
            <FaPlus/>
          </button>
        </div>
      </div>

      <div className="col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-900"
        >
          Create Plan
        </button>
      </div>
    </form>
  );
};

export default CreatePlan;