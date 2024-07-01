import {defineField, defineType} from 'sanity'

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