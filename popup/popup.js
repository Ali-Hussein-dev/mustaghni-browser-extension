// popup.js

chrome.storage.local.get(["mustaghniZItem"]).then((result) => {
  const mustaghniZItem = result.mustaghniZItem
  if (!mustaghniZItem) {
    return window.close()
  }
  const { _id, title, logo, evidence, alternatives, type } = mustaghniZItem
  // let normalizeEvid = normalizeEvidence(evidence)
  let msg = ``
  let category = type === 'brand' ? 'brand' : 'company'
  let logoUrl = "https://bulma.io/assets/images/placeholders/128x128.png"
  if (logo && logo.length > 0) {
    logoUrl = logo
  }
  msg += `
    <div class="logoContainer">
      <figure class="image is-48x48">
        <img src=${logoUrl} />
      </figure>
      <br/>
    </div>
    `

  msg +=
    `<b>${title}</b>, a ${category}.`

  // if (normalizeEvid?.reason) {
  //   msg += `
  //   <br/><br/><p>
  //   ${normalizeEvid.reason}</p>
  //   `
  // }

  // if (normalizeEvid?.proof) {
  //   msg += `
  //   <br/><br/>
  //   <a class="button btn_btm" id="mustaghniZProof" href=${normalizeEvid.proof}>Proof
  //   </a>`
  // }

  if (alternatives?.at(0)?.children && alternatives.at(0)?.children.length !== 0) {

    msg += `
   <br/>
   <div class="alternatives">
     <p>Alternatives</p>
     <ul>
     ${normalizeAlternatives(alternatives).map(({ text, link }) => {
      if (link) {
        return `<li><a href=${link}>${text}</a></li>`
      }
      return `<li>${text}</li>`
    }).join('\n')}
     </ul>
   </div>
   `
  }

  const url = `https://mustaghni.org/en/brands/${_id}`
  msg += `
     </br>
     <a class="button btn_btm" id="mustaghniZProof" href=${url}>Details</a>
  `


  document.getElementById("mustaghniZ").innerHTML = msg
  if (url) {
    document.getElementById("mustaghniZProof").addEventListener('click', (event) => {
      let ur = event.target.getAttribute('href')
      chrome.tabs.create({ url: ur });
    })
  }

});

// function normalizeEvidence(evidence) {
//   if (evidence?.at(0)?.children && evidence.at(0)?.children.length !== 0) {
//     let reason = evidence?.at(0)?.children.find(c => c?.text && c?.text?.length > 0)?.text
//     let proof = evidence?.at(0)?.children.find(c => c?.href && c?.href?.length > 0)?.href
//     return { reason, proof }
//   }
//   return null
// }

function normalizeAlternatives(alternatives) {
  if (alternatives?.at(0)?.children && alternatives.at(0)?.children.length !== 0) {
    let children = alternatives?.at(0)?.children
    let refs = alternatives?.at(0)?.markDefs
    let alts = []
    for (const ch of children) {
      const text = ch?.text ?? ""
      const refKey = ch?.marks?.at(1) ?? ""
      const link = refs.find(ref => ref?._key === refKey)?.href
      alts.push({ text, link })
    }
    console.log(alts)
    return alts
  }
  else {
    return null
  }
}
// You can update the badge text as needed.
