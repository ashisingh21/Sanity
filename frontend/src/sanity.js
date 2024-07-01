import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId:  "fbqjhpn5",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});


export async function sanityFetch({ query, params = {}, tags }) {
  const isDevelopment = import.meta.env.NODE_ENV === 'development';
  return client.fetch(query, params, {
    next: {
      revalidate: isDevelopment ? 30 : 3600,
      tags,
    },
  });
}

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}