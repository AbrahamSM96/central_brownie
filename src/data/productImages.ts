// Maps product ID prefixes to their photo path in /public/productos/
// Multiple size variants of the same product share one photo.
const prefixMap: Array<[string, string]> = [
  ['mini-brownies-pink', '/productos/mini-brownies-pink.jpg'],
  ['mini-brownie-ck', '/productos/mini-brownie-cheesecake.jpg'],
  ['mini-brownies', '/productos/mini-brownies.jpg'],
  ['mini-cheesecakes', '/productos/mini-cheesecakes-caja.jpg'],
  ['mini-cake', '/productos/mini-cake.jpg'],
  ['brownie-oblea', '/productos/brownie-oblea.jpg'],
  ['brownie-ck', '/productos/brownies-cheesecake.jpg'],
  ['pizza-brownie-ck', '/productos/pizza-brownie-cheesecake.jpg'],
  ['pizza-corabrownie-ck', '/productos/pizza-corabrownie-cheesecake.jpg'],
  ['pizza-brownie', '/productos/pizza-brownie.jpg'],
  ['pizza-corabrownie', '/productos/pizza-corabrownie.jpg'],
  ['pizza-big-cookie', '/productos/pizza-big-cookie.jpg'],
  ['corabrownies', '/productos/caja-corabrownies.jpg'],
  ['brownies', '/productos/caja-brownies.jpg'],
  ['big-cookie-corazon', '/productos/big-cookie-corazon.jpg'],
  ['big-cookie', '/productos/caja-big-cookie.jpg'],
  ['donuts', '/productos/caja-donas.jpg'],
  ['cupcakes-toppings', '/productos/cupcakes-toppings.jpg'],
  ['cupcakes-fondant', '/productos/cupcakes-fondant.jpg'],
  ['cupcakes-oblea', '/productos/cupcakes-toppings.jpg'],
  ['cheesecake-familiar', '/productos/cheesecake-berries.jpg'],
  ['cheesecake', '/productos/mini-cheesecake-individual.jpg'],
  ['combinada', '/productos/mini-cheesecake-individual.jpg'],
  ['browcake', '/productos/pastel-brownie.jpg'],
  ['galletas-polaroid', '/productos/galletas-foto.jpg'],
  ['galletas-oblea', '/productos/galletas-oblea.jpg'],
  ['pastel-evento', '/productos/pastel-evento.jpg'],
]

export function getProductImage(id: string): string | undefined {
  for (const [prefix, path] of prefixMap) {
    if (id === prefix || id.startsWith(`${prefix}-`)) return path
  }
  return undefined
}
