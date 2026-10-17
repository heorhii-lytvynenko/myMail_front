import activity from './assets/activity.svg?react'
import alert from './assets/alert.svg?react'
import apple from './assets/apple.svg?react'
import arrowDown from './assets/arrowDown.svg?react'
import arrowLeft from './assets/arrowLeft.svg?react'
import arrowRight from './assets/arrowRight.svg?react'
import arrowUp from './assets/arrowUp.svg?react'
import bookmark from './assets/bookmark.svg?react'
import briefcase from './assets/briefcase.svg?react'
import building from './assets/building.svg?react'
import burger from './assets/burger.svg?react'
import calendar from './assets/calendar.svg?react'
import camera from './assets/camera.svg?react'
import check from './assets/check.svg?react'
import checkCircle from './assets/checkCircle.svg?react'
import chevronDown from './assets/chevronDown.svg?react'
import chevronUp from './assets/chevronUp.svg?react'
import clipboardCheck from './assets/clipboardCheck.svg?react'
import clock from './assets/clock.svg?react'
import code from './assets/code.svg?react'
import coins from './assets/coins.svg?react'
import dice from './assets/dice.svg?react'
import externalLink from './assets/externalLink.svg?react'
import eye from './assets/eye.svg?react'
import eyeOff from './assets/eyeOff.svg?react'
import facebook from './assets/facebook.svg?react'
import fileText from './assets/fileText.svg?react'
import filter from './assets/filter.svg?react'
import flash from './assets/flash.svg?react'
import globe from './assets/globe.svg?react'
import google from './assets/google.svg?react'
import instagram from './assets/instagram.svg?react'
import layers from './assets/layers.svg?react'
import layoutGrid from './assets/layoutGrid.svg?react'
import layoutList from './assets/layoutList.svg?react'
import like from './assets/like.svg?react'
import linkedin from './assets/linkedin.svg?react'
import lock from './assets/lock.svg?react'
import logo from './assets/logo.svg?react'
import mail from './assets/mail.svg?react'
import mapPin from './assets/mapPin.svg?react'
import megaphone from './assets/megaphone.svg?react'
import monitor from './assets/monitor.svg?react'
import scan from './assets/scan.svg?react'
import search from './assets/search.svg?react'
import share from './assets/share.svg?react'
import sparkles from './assets/sparkles.svg?react'
import star from './assets/star.svg?react'
import tag from './assets/tag.svg?react'
import target from './assets/target.svg?react'
import twitter from './assets/twitter.svg?react'
import user from './assets/user.svg?react'
import users from './assets/users.svg?react'
import wallet from './assets/wallet.svg?react'
import x from './assets/x.svg?react'
import youtube from './assets/youtube.svg?react'

export const ICONS = {
  arrowDown,
  arrowUp,
  arrowLeft,
  arrowRight,
  bookmark,
  briefcase,
  calendar,
  checkCircle,
  chevronDown,
  chevronUp,
  clock,
  eye,
  eyeOff,
  externalLink,
  fileText,
  filter,
  globe,
  layers,
  layoutGrid,
  layoutList,
  mapPin,
  megaphone,
  monitor,
  search,
  sparkles,
  star,
  tag,
  user,
  users,
  wallet,
  x,
  logo,
  linkedin,
  like,
  facebook,
  twitter,
  instagram,
  youtube,
  share,
  target,
  check,
  coins,
  burger,
  dice,
  code,
  clipboardCheck,
  mail,
  apple,
  google,
  flash,
  scan,
  activity,
  lock,
  alert,
  camera,
  building
} as const

export type IconType = keyof typeof ICONS
