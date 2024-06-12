export const applicationProperties = {
    isTesting: false,
    defaultTheme: {
        code: 'light',
        icon: 'Light',
        name: 'Light',
    },
    themes: [
        {
            code: 'dark',
            icon: 'Dark',
            name: 'Dark',
        },
        {
            code: 'light',
            icon: 'Light',
            name: 'Light',
        },
    ],
    defaultCurrency: {code: 'USD', value: 1, name: 'US Dollar', symbol: '$'},
    currencies: [
        {
            code: 'AUD',
            name: 'Australian Dollar',
            symbol: '$',
        },
        {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
        },
        {
            code: 'GBP',
            name: 'British Pound',
            symbol: '£',
        },
        {
            code: 'RUB',
            name: 'Russian Ruble',
            symbol: '₽',
        },
        {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
        },
    ],
    defaultWalletName: 'XPAY Wallet',
    logoURI: {
        app: 'https://i.ibb.co/ZdkdCsT/1024.png',
        eth: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        bsc: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
        polygon:
            'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
        tron: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
        noImage: 'https://epay-images.s3.us-east-2.amazonaws.com/no-photo.png',
        trc20: 'https://tokens.pancakeswap.finance/images/0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B.png',
        xusdt: 'https://static.tronscan.org/production/upload/logo/new/TAZ1dbBfBCELD49obL3Agh9GtYVrp3jkJL.png?t=1715415057068',
    },
    endpoints: {
        app: {
            url: 'https://dukuwallet-2aeb92c5caa8.herokuapp.com/', //to this url <<<
            wssUrl: 'https://dukuwallet-2aeb92c5caa8.herokuapp.com/wss/v1/hello-wss',
        },
        privacyPolicy: 'https://metaxbank.io/home/',
        termsOfService: 'https://metaxbank.io/home/',
        ramp: 'https://app.ramp.network/?hostApiKey=ycrtmt9ec9xmgn3cgqvgbt9sw6jyptmxyfnm7f3x&hostAppName=VCoinLab&hostLogoUrl=https://gcdnb.pbrd.co/images/TkytqqjxUNgG.png?o=1',
        helpCenter: 'https://metaxbank.io/home/',
        twitter: '',
        telegram: '',
        facebook: '',
        reddit: '',
        youtube: '',
        about: '',
        discord: '',
    },
    dapps: [
        {
            id: 'metaxbank',
            name: 'METAXBANK',
            desc: 'Send Money Overseas Fast,Seamless and Low Cost',
            logo: 'https://gcdnb.pbrd.co/images/TkytqqjxUNgG.png?o=1',
            url: 'https://metaxbank.io/',
        },
        {
            id: 'metaxbook',
            name: 'METAXBOOK',
            desc: 'Your Next Social Media',
            logo: 'https://gcdnb.pbrd.co/images/TkytqqjxUNgG.png?o=1',
            url: 'https://metaxbook.io',
        },
        {
            id: 'metaxfuture',
            name: 'METAXFUTURE',
            desc: 'Meta X AI data Analysis',
            logo: 'https://gcdnb.pbrd.co/images/TkytqqjxUNgG.png?o=1',
            url: 'https://login.metaxproject.io/chart',
        },
    ],
    walletConnect: {
        description: 'VCoinLab Wallet',
        url: 'https://www.vcoinlab.com/blog/privacy-policy',
        icons: ['https://www.vcoinlab.com/static/images/logo.png'],
        name: 'VCoinLab Wallet',
        ssl: true,
    },
    oneSignal: {
        appId: '63da9a2a-4ea6-4c98-8cf6-ecef0a6e851d',
    },
    networks: [
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            chain: 'ETH',
            logoURI:
                'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        },
        {
            id: 'binance-chain',
            name: 'Binance Smart Chain',
            chain: 'BSC',
            symbol: 'BNB',
            logoURI:
                'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
        },
        {
            id: 'polygon',
            name: 'Polygon',
            chain: 'POLYGON',
            symbol: 'MATIC',
            logoURI:
                'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
        },
        {
            id: 'tron',
            name: 'Tron',
            chain: 'TRON',
            symbol: 'TRX',
            logoURI:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/1958.png',
        },
    ],
};
