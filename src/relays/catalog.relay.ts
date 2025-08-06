import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const addProductImage = () => {
  relay(
    {
      name: Action.Catalog.ADD_PRODUCT_IMAGE,
    },
    async ({ body }) => {
      const { productId, content } = body
      return await WPP.catalog.addProductImage(productId, content)
    },
  )
}

const changeProductImage = () => {
  relay(
    {
      name: Action.Catalog.CHANGE_PRODUCT_IMAGE,
    },
    async ({ body }) => {
      const { productId, content } = body
      return await WPP.catalog.changeProductImage(productId, content)
    },
  )
}

const createCollection = () => {
  relay(
    {
      name: Action.Catalog.CREATE_COLLECTION,
    },
    async ({ body }) => {
      const { collectionName, productsId } = body
      return await WPP.catalog.createCollection(collectionName, productsId)
    },
  )
}

const createProduct = () => {
  relay(
    {
      name: Action.Catalog.CREATE_COLLECTION,
    },
    async ({ body }) => {
      return await WPP.catalog.createProduct(body)
    },
  )
}

const deleteCollection = () => {
  relay(
    {
      name: Action.Catalog.DELETE_COLLECTION,
    },
    async ({ body }) => {
      return await WPP.catalog.deleteCollection(body)
    },
  )
}

const deleteProduct = () => {
  relay(
    {
      name: Action.Catalog.DELETE_PRODUCT,
    },
    async ({ body }) => {
      return await WPP.catalog.delProducts(body)
    },
  )
}

const editCollection = () => {
  relay(
    {
      name: Action.Catalog.EDIT_COLLECTION,
    },
    async ({ body }) => {
      const { collectionId, params } = body
      return await WPP.catalog.editCollection(collectionId, params)
    },
  )
}

const editProduct = () => {
  relay(
    {
      name: Action.Catalog.EDIT_PRODUCT,
    },
    async ({ body }) => {
      const { productId, params } = body
      return await WPP.catalog.editProduct(productId, params)
    },
  )
}

const getCollections = () => {
  relay(
    {
      name: Action.Catalog.GET_COLLECTIONS,
    },
    async ({ body }) => {
      const { chatId, qnt, productsCount } = body
      return await WPP.catalog.getCollections(chatId, qnt, productsCount)
    },
  )
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
const getMyCatalog = () => {
  relay(
    {
      name: Action.Catalog.GET_MY_CATALOG,
    },
    async ({ body }) => {
      return await WPP.catalog.getMyCatalog()
    },
  )
}

const getProductById = () => {
  relay(
    {
      name: Action.Catalog.GET_PRODUCT_BY_ID,
    },
    async ({ body }) => {
      const { chatId, productId } = body
      return await WPP.catalog.getProductById(chatId, productId)
    },
  )
}

const getProducts = () => {
  relay(
    {
      name: Action.Catalog.GET_PRODUCTS,
    },
    async ({ body }) => {
      const { chatId, qnt } = body
      return await WPP.catalog.getProducts(chatId, qnt)
    },
  )
}

const removeProductImage = () => {
  relay(
    {
      name: Action.Catalog.REMOVE_PRODUCT_IMAGE,
    },
    async ({ body }) => {
      const { productId, index } = body
      return await WPP.catalog.removeProductImage(productId, index)
    },
  )
}

const setProductVisibility = () => {
  relay(
    {
      name: Action.Catalog.SET_PRODUCT_VISIBILITY,
    },
    async ({ body }) => {
      const { productId, isHidden } = body
      return await WPP.catalog.setProductVisibility(productId, isHidden)
    },
  )
}

const updateCartEnabled = () => {
  relay(
    {
      name: Action.Catalog.UPDAGE_CART_ENABLED,
    },
    async ({ body }) => {
      return await WPP.catalog.updateCartEnabled(body)
    },
  )
}

const initCatalogRelays = () => {
  addProductImage()
  changeProductImage()
  createCollection()
  createProduct()
  deleteCollection()
  deleteProduct()
  editCollection()
  editProduct()
  getCollections()
  getMyCatalog()
  getProductById()
  getProducts()
  removeProductImage()
  setProductVisibility()
  updateCartEnabled()
}

export default initCatalogRelays
