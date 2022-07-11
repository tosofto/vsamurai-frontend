export default {
  getUserNFTs: state => sorting => {   
    return state.collectable.userNFTs && state.collectable.userNFTs.sort((a,b) => {
      let aNumber = parseInt(a.id)
      let bNumber = parseInt(b.id)
      return sorting === 'DESCENDING' ? bNumber - aNumber : aNumber - bNumber
    })     
  }
}