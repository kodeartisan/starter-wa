import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { createProductParams } from '@wppconnect/wa-js/dist/catalog/functions/createProduct'
import type { editProductParams } from '@wppconnect/wa-js/dist/catalog/functions/editProduct'

/**
 * Add image on product
 * This function include additional images on product
 * for change main image use @changeProductImage
 *
 * @example
 * ```javascript
 * await wa.catalog.addProductImage('686859858689', 'data:image/jpeg;base64,.....');
 * ```
 */
export const addProductImage = async (
  productId: string,
  content: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.ADD_PRODUCT_IMAGE,
    body: { productId, content },
  })
}

/**
 * Add image on product
 * This function change main image of product
 * for change additional images use @addProductImage
 *
 * @example
 * ```javascript
 * await wa.catalog.changeProductImage('686859858689', 'data:image/jpeg;base64,.....');
 * ```
 */
export const changeProductImage = async (
  productId: string,
  content: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.CHANGE_PRODUCT_IMAGE,
    body: { productId, content },
  })
}

/**
 * Create new collection
 *
 * @example
 * ```javascript
 * const myCatalog = await wa.catalog.createCollection('Collection Name', ['565656589898']);
 * ```
 */
export const createCollection = async (
  collectionName: string,
  productsId: string[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.CREATE_COLLECTION,
    body: { collectionName, productsId },
  })
}

/**
 * Create new product
 *
 * @example
 * ```javascript
 * const myCatalog = await wa.catalog.addProduct(
    {
      name: 'Product name', 
      image: 'base64 image string', 
      description: 'product description',
      price: '89.90',
      isHidden: false,
      url: 'https://wppconnect.io',
      retailerId: 'AKA001',
    }
  );
 * ```
 */
export const createProduct = async (
  params: createProductParams,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.CREATE_PRODUCT,
    body: params,
  })
}

/**
 * Delete a collection
 *
 * @example
 * ```javascript
 * const myCatalog = await wa.catalog.deleteCollection("377095767832354");
 * ```
 *
 * @return Return sucess or error
 */
export const deleteCollection = async (collectionId: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.DELETE_COLLECTION,
    body: collectionId,
  })
}

/**
 * @example
 * ```javascript
 *
 * // Delete various products
 * const myCatalog = await wa.catalog.delProducts(['6104203702939361', '6104289702939361']);
 * ```
 */
export const deleteProduct = async (productsIds: string[]): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.DELETE_PRODUCT,
    body: productsIds,
  })
}

/**
 * @example
 * ```javascript
 * const myCatalog = await wa.catalog.EditCollection('565656589898', { collectionName: 'New Name for collection', productsToAdd: ['5656523223'], productsToRemove: ['5656523232']});
 * ```
 */

interface paramsEditCollection {
  name?: string
  productsToAdd?: string[]
  productsToRemove?: string[]
}

export const editCollection = async (
  collectionId: string,
  params: paramsEditCollection,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.EDIT_COLLECTION,
    body: { collectionId, params },
  })
}

/**
 * @example
 * ```javascript
 * // Get your current catalog
 * const myCatalog = wa.catalog.editProduct('5498255476885590', {name: 'Plano 01', price: '89990', description: 'Insert description for your product', isHidden: true, url: 'http://www.wppconnect.io', retailerId: 'AKA001'});
 * ```
 */
export const editProduct = async (
  productId: string,
  params: editProductParams,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.EDIT_PRODUCT,
    body: { productId, params },
  })
}

/**
 * Get collections of catalog
 *
 * @example
 * ```javascript
 * // Retrieve 20 collections of chat
 * const myCatalog = await wa.catalog.getCollections('552198554578@c.us', '20');
 *
 * // Retrieve 20 collections of chat and products arrays limit with 10 products
 * const myCatalog = await wa.catalog.getCollections('552198554578@c.us', '20', '10');
 * ```
 */
export const getCollections = async (
  chatId: string,
  qnt?: number,
  productsCount?: number,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.GET_COLLECTIONS,
    body: { chatId, qnt, productsCount },
  })
}

/**
 * Get your current catalog
 *
 * @example
 * ```javascript
 * // Get your current catalog
 * const myCatalog = await wa.catalog.getMyCatalog();
 * ```
 */
export const getMyCatalog = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.GET_MY_CATALOG,
    body: {},
  })
}

/**
 * Retrieves product by id
 *
 * @example
 * ```javascript
 * // Retrieve data of product
 * await wa.catalog.getProductById('5521985565656@c.us', '68685985868923');
 * ```
 */
export const getProductById = async (
  chatId: string,
  productId: number,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.GET_PRODUCT_BY_ID,
    body: { chatId, productId },
  })
}

/**
 * Retrieves product by contact id
 *
 * @example
 * Get products of catalogs
 * ```javascript
 * await wa.catalog.getProducts('5521985625689@c.us', 10);
 * ```
 */
export const getProducts = async (chatId: string, qnt: number): Promise<[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.GET_PRODUCTS,
    body: { chatId, qnt },
  })
}

/**
 * Remove image on product
 * This function remove additional images of product
 * for change main image use @changeProductImage
 *
 * @example
 * ```javascript
 * await wa.catalog.removeProductImage('68685985868923', '0');
 * ```
 */

export const removeProductImage = async (
  productId: string,
  index: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.REMOVE_PRODUCT_IMAGE,
    body: { productId, index },
  })
}

/**
 * Get your current catalog
 *
 * @example
 * ```javascript
 * // Set product visibility hidden
 * const myCatalog = await wa.catalog.setProductVisibility(54985569989897, true);
 * ```
 * // Set product visible
 * const myCatalog = await wa.catalog.setProductVisibility(54985569989897, false);
 * ```
 */
export const setProductVisibility = async (
  productId: any,
  isHidden: boolean,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.SET_PRODUCT_VISIBILITY,
    body: { productId, isHidden },
  })
}

/**
 * Get your current catalog
 *
 * @example
 * ```javascript
 * // Set product visibility hidden
 * const myCatalog = await wa.catalog.setProductVisibility(54985569989897, true);
 * ```
 * // Set product visible
 * const myCatalog = await wa.catalog.setProductVisibility(54985569989897, false);
 * ```
 *
 * @return Return sucess of product visibility set
 */
export const updateCartEnabled = async (enabled: boolean): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Catalog.UPDAGE_CART_ENABLED,
    body: enabled,
  })
}
