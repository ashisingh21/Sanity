import {defineField, defineType} from 'sanity'

// Define the schema for the location
export const locationSchema = defineType({
  name: 'location',
  title: 'Location',
  description: 'Schema for Different Locations',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
        name: 'address',
        type: 'string',
      }),
    defineField({
      name: 'mapUrl',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'zomato',
      type: 'string',
      defaultValue: 'https://www.zomato.com/mumbai/jimis-burger-andheri-lokhandwala',
    }),
    defineField({
      name: 'swiggy',
      type: 'string',
      defaultValue: 'https://www.swiggy.com/restaurants/jimis-burger-veera-desai-mumbai-33663',
    }),
    defineField({
      name: 'contact',
      type: 'string',
      defaultValue: '7738427090',
    }),
    defineField({
      name: 'state',
      type: 'string',
      defaultValue: 'Delhi',
    }),
    defineField({
      name: 'city',
      type: 'string',
      defaultValue: 'Delhi',
    }),
    defineField({
      name: 'timings',
      type: 'string',
      defaultValue: '11 am till 12 midnight',
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
        defaultValue: () => new Date().toISOString(),
        readOnly: true,
      }
    
    }),
  ],
})