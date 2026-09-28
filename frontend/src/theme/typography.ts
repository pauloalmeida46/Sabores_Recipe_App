export const fonts = {
  serifRegular: 'PlayfairDisplay_400Regular',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sans: 'System',
};

export const typography = {
  screenTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 34,
    lineHeight: 40,
  },
  cardTitle: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  cardTitleSmall: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 17,
    lineHeight: 22,
  },
  eyebrow: {
    fontFamily: fonts.sans,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  sectionLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    letterSpacing: 1.1,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 21,
  },
  bodyStrong: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  statNumber: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
  },
};
