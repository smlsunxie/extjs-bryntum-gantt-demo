module.exports =
  index: (req, res, next) ->

    res.send "yes!!!"
    return

  save: (req, res, next) ->

    res.send req.body

    return


  _config: {}
