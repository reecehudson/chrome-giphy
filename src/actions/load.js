

import xhr from "xhr"
import c from "../constants"

// NOTE: i don't like this being in the global module scope
// but it also doesn't belong in the redux store b/c it does not reflect UI
// changes when it is updated
const pagination = {
  search: 0,
  trending: 0
}

// NOTE: all params are required except cb
function load(shouldReplace, activeIcon, stickerMode, queries, cb) {
  return function (dispatch) {
    let search, uri

    cb = cb || (() => void(0))

    updatePagination(activeIcon, shouldReplace, pagination)

    // pagination
    activeIcon in pagination ?
      queries = applyPagination(queries, pagination[activeIcon]) :
      void(0)

    // format search part of uri
    search = formatQueries(queries)

    // format relative uri
    uri = formatURI(activeIcon, stickerMode, search)

    xhr({
      method: "GET",
      uri,
      json: true
      }, function (err, resp, body) {
          let data

          if (err)
            throw new Error("xhr error ", err.message)
          if (+resp.statusCode !== 200)
            throw new Error("xhr error status code" + resp.statusCode)

          data = normalizeData(body, activeIcon)
          dispatch({
            type: shouldReplace ? c.CURRENT_REPLACE : c.CURRENT_APPEND,
            activeIcon,
            data
          })
          cb()
        }
      )
  }

  function formatURI(activeIcon, stickerMode, search) {
    let resource = stickerMode ? "stickers" : "gifs"
    return `/v1/${resource}/${activeIcon}` + search
  }

  function applyPagination(queries, paginationN) {
    let ret = Object.assign({}, queries)
    ret.offset = (paginationN  * queries.limit)
    return ret;
  }

  function formatQueries(queries) {
    let str = "",
        first = true,
        val
    for (const key in queries) {
      if (queries.hasOwnProperty(key)) {
        if (first) {
          str += "?"
          first = false
        } else {
          str += "&"
        }
        val = encodeURIComponent(queries[key])
        str += `${key}=${val}`
      }
    }
    return str
  }

  function updatePagination(activeIcon, shouldReset, pagination) {
    shouldReset ?
      pagination[activeIcon] = 0 :
      pagination[activeIcon] += 1
  }

  function normalizeData(body, activeIcon) {
    switch (activeIcon) {
      case "search":
      case "trending":
      case "translate":
        return body.data

      case "random":
        // TEMP: ideally use unflatten()
        let img = ((body.data.images = {}).fixed_width_small = {});
        img.width = body.data.fixed_width_small_width
        img.height = body.data.fixed_width_small_height
        img.url = body.data.fixed_width_small_url
        body.data.images.original = {url: body.data.original_url}
        return [body.data]

      default:
        throw new Error("unknown activeIcon")
    }

    // function unflatten(imgObj) {
    //   const sep = "_", tO = {}
    //
    //   for (const key in imgObj) {
    //     if (imgObj.hasOwnProperty(key)) {
    //       let val = imgObj[key],
    //           o = tO
    //       key.split(sep).forEach((key2, ind, arr) => {
    //           let final = ind === arr.length -1
    //           if (final) {
    //             o[key2] = val
    //           } else {
    //             let oo = o[key2]
    //             if (!oo) {
    //               o[key2] = {}
    //               o = o[key2]
    //             }
    //           }
    //       })
    //     }
    //   }
    // }
  }
}

export default load
