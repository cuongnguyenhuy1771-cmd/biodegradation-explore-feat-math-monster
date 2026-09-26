module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // 1. Worklets (alias của react-native-worklets-core - dùng tên alias để tránh trùng class trên Android)
      'react-native-worklets/plugin',

      [
        'react-native-iconify/babel',
        {
          icons: [
            'solar:cart-large-bold-duotone',
            'solar:cart-3-bold-duotone',
            'solar:donut-bold-duotone',
            'solar:scooter-bold-duotone',
            'solar:video-frame-play-vertical-bold-duotone',
            'solar:cosmetic-bold-duotone',
            'solar:health-bold-duotone',
            'solar:bill-list-bold-duotone',
            'solar:home-bold-duotone',
            'solar:people-nearby-bold-duotone',
            'solar:money-bag-bold-duotone',
            'solar:square-academic-cap-bold-duotone',
            'solar:banknote-2-bold-duotone',
            'solar:bill-check-bold-duotone',
            'solar:cash-out-bold-duotone',
            'solar:wallet-2-bold-duotone',
            'solar:dollar-bold-duotone',
            'solar:medal-ribbons-star-bold-duotone',
            'solar:archive-down-minimlistic-bold-duotone',
            'solar:graph-new-up-bold-duotone',
            'solar:wad-of-money-bold-duotone',
            'solar:suitcase-lines-bold-duotone',
            'solar:presentation-graph-bold-duotone',
            'solar:round-graph-bold-duotone',
            'solar:diagram-up-bold-duotone',
            'solar:inbox-in-bold-duotone',
            'solar:pen-new-square-bold-duotone',
            'solar:confetti-bold-duotone',
            'solar:gift-bold-duotone',
            'solar:book-bookmark-bold-duotone',
            'solar:buildings-2-bold-duotone',
            'solar:hanger-2-bold-duotone',
            'solar:body-bold-duotone',
            'solar:video-frame-bold-duotone',
            'solar:golf-bold-duotone',
            'solar:pills-bold-duotone',
          ],
        },
      ],
      // 2. Thêm plugin Reanimated (LUÔN PHẢI ĐỂ Ở CUỐI CÙNG trong mảng plugins)
      'react-native-reanimated/plugin',
    ],
  }
}
