import {faker} from '@faker-js/faker';
import {config} from 'dotenv';
import {resolve} from 'path';

// Load environment variables from .env file
const envPath = resolve(process.cwd(), '.env');
const result = config({path: envPath});

if (result.error) {
  console.warn(`⚠️  Warning: Could not load .env file from ${envPath}`);
  console.warn(`   ${result.error.message}`);
  console.warn('   Continuing with system environment variables...\n');
}

// Configuration from environment variables
const SHOP_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || '';
const ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';

if (!SHOP_DOMAIN || !ADMIN_API_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  if (!SHOP_DOMAIN) console.error('   - PUBLIC_STORE_DOMAIN');
  if (!ADMIN_API_ACCESS_TOKEN) console.error('   - SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  console.error(`\n💡 Checked .env file at: ${envPath}`);
  console.error('   Make sure your .env file contains both variables.');
  console.error('\n📖 To get Admin API access token:');
  console.error('   1. Go to Shopify Admin > Settings > Apps and sales channels');
  console.error('   2. Click "Develop apps" > "Create an app"');
  console.error('   3. Configure Admin API scopes:');
  console.error('      - write_products');
  console.error('      - write_custom_collections');
  console.error('   4. Install the app and copy the Admin API access token');
  console.error('   5. Add it to your .env file as SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  process.exit(1);
}

const API_VERSION = '2025-01';
const GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
const REST_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;

// GraphQL Mutations (for collections)

const CREATE_COLLECTION_MUTATION = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_PRODUCT_TO_COLLECTION_MUTATION = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper function to make GraphQL requests
async function graphqlRequest(query: string, variables: Record<string, any>) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_ACCESS_TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

// Helper function to make REST API requests
async function restRequest(endpoint: string, method: string, body?: any) {
  const response = await fetch(`${REST_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_ACCESS_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  return await response.json();
}

// Create a single product using REST API
async function createProduct() {
  const productData = {
    product: {
      title: faker.commerce.productName(),
      body_html: `<p>${faker.commerce.productDescription()}</p>`,
      vendor: faker.company.name(),
      product_type: faker.commerce.department(),
      variants: [
        {
          price: faker.commerce.price({min: 10, max: 500, dec: 2}),
          sku: faker.string.alphanumeric(8).toUpperCase(),
          inventory_quantity: faker.number.int({min: 0, max: 100}),
        },
      ],
      images: [
        {
          src: faker.image.url({width: 800, height: 800}),
          alt: faker.commerce.productName(),
        },
      ],
      tags: [
        faker.commerce.department(),
        faker.commerce.productAdjective(),
      ].join(', '),
    },
  };

  try {
    const data = await restRequest('/products.json', 'POST', productData);

    if (data.errors) {
      console.error('❌ Error creating product:', data.errors);
      return null;
    }

    const product = data.product;
    console.log(`✓ Product created: ${product.title}`);
    return {
      id: `gid://shopify/Product/${product.id}`,
      title: product.title,
      handle: product.handle,
    };
  } catch (error: any) {
    console.error('❌ Error creating product:', error.message);
    return null;
  }
}

// Create a collection
async function createCollection() {
  const collectionData = {
    title: faker.commerce.department(),
    descriptionHtml: `<p>${faker.lorem.paragraph()}</p>`,
  };

  try {
    const data = await graphqlRequest(CREATE_COLLECTION_MUTATION, {
      input: collectionData,
    });

    const result = data.collectionCreate;
    
    if (result.userErrors && result.userErrors.length > 0) {
      console.error('❌ Error creating collection:', result.userErrors);
      return null;
    }

    console.log(`✓ Collection created: ${result.collection.title}`);
    return result.collection;
  } catch (error: any) {
    console.error('❌ Error creating collection:', error.message);
    return null;
  }
}

// Add products to collection
async function addProductsToCollection(
  collectionId: string,
  productIds: string[]
) {
  try {
    const data = await graphqlRequest(ADD_PRODUCT_TO_COLLECTION_MUTATION, {
      id: collectionId,
      productIds: productIds,
    });

    const result = data.collectionAddProducts;
    
    if (result.userErrors && result.userErrors.length > 0) {
      console.error(
        '❌ Error adding products to collection:',
        result.userErrors
      );
      return false;
    }

    console.log(`✓ Added ${productIds.length} products to collection`);
    return true;
  } catch (error: any) {
    console.error('❌ Error adding products to collection:', error.message);
    return false;
  }
}

// Rate limiting helper
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main function
async function generateSampleData() {
  const productCount = parseInt(process.argv[2]) || 10;
  const collectionCount = parseInt(process.argv[3]) || 3;

  console.log(`\n🚀 Generating sample data...`);
  console.log(`   Products: ${productCount}`);
  console.log(`   Collections: ${collectionCount}\n`);

  // Create products
  console.log('📦 Creating products...');
  const products: Array<{id: string; title: string; handle: string}> = [];
  for (let i = 0; i < productCount; i++) {
    const product = await createProduct();
    if (product) {
      products.push(product);
    }
    // Rate limiting: wait 500ms between requests
    if (i < productCount - 1) {
      await delay(500);
    }
  }

  // Create collections
  console.log('\n📁 Creating collections...');
  const collections: Array<{id: string; title: string; handle: string}> = [];
  for (let i = 0; i < collectionCount; i++) {
    const collection = await createCollection();
    if (collection) {
      collections.push(collection);
    }
    // Rate limiting: wait 500ms between requests
    if (i < collectionCount - 1) {
      await delay(500);
    }
  }

  // Distribute products across collections
  if (collections.length > 0 && products.length > 0) {
    console.log('\n🔗 Associating products with collections...');
    const productsPerCollection = Math.ceil(products.length / collections.length);
    
    for (let i = 0; i < collections.length; i++) {
      const start = i * productsPerCollection;
      const end = Math.min(start + productsPerCollection, products.length);
      const collectionProducts = products.slice(start, end);
      
      if (collectionProducts.length > 0) {
        await addProductsToCollection(
          collections[i].id,
          collectionProducts.map((p) => p.id)
        );
        // Rate limiting
        if (i < collections.length - 1) {
          await delay(500);
        }
      }
    }
  }

  console.log(`\n✅ Sample data generation complete!`);
  console.log(`   Created ${products.length} products`);
  console.log(`   Created ${collections.length} collections`);
  console.log(`\n💡 View your products in Shopify Admin:`);
  console.log(`   https://${SHOP_DOMAIN}/admin/products`);
}

// Run the script
generateSampleData().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

