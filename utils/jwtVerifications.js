const jwt = require('jsonwebtoken')
require('dotenv/config')

const createAccessToken = (usuario) => {
  return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: "5h" })
}

const createRefreshToken = (usuario) => {
  return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const createSesion = (res, usuario) => {
  const refresh = createRefreshToken(usuario)
  const access = createAccessToken(usuario)
  try {
    res
      .cookie("refreshToken", refresh,
        {
          sameSite: "lax",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
      .cookie("accessToken", access,
        {
          sameSite: "lax",
          secure: true,
          maxAge: 5 * 60 * 60 * 1000
        })
    console.log("Cookies creadas",)
    return true
  } catch (error) {
    console.log(error.message)
    return false
  }

}

const verifyRefreshToken = (refreshToken) => {
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH)
    const {iat, exp, password, id, created_at, ...newUser} = user
    return newUser
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const verifyAccessToken = (accessToken) => {
  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET)
    const {iat, exp, password, id, created_at, ...newUser} = user
    return newUser
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const verifySesion = (req, res, next) => {
  
  try {
    const refreshToken = req.cookies["refreshToken"]
    const accessToken = req.cookies["accessToken"]
    
    if (!accessToken && !refreshToken) return res.status(401).json({ confirmation: false, message: 'Something went wrong!' });

    if (!accessToken && refreshToken) {
      
      const user = verifyRefreshToken(refreshToken)
      
      if (!user) return res.status(401).json({ confirmation: false, message: 'Something went wrong!' });
      try {
        const access = createAccessToken(user)
        res.cookie('accessToken', access, { sameSite: "lax", secure: true, maxAge: 5 * 60 * 60 * 1000 })
        req.user = user
        next()
      } catch (error) {
        console.log("error: ", error.message)
        return res.status(500).json({ confirmation: false, message: 'Something went wrong!' });
      }
    }
    // if there is an access token:
    const user = verifyAccessToken(accessToken)
    if (!user) return res.status(401).json({ confirmation: false, message: 'Something went wrong!' });
    req.user = user
    next()

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ confirmation: false, message: 'Something went wrong!' });
  }
}

module.exports = {
  createSesion,
  verifySesion
}