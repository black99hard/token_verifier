import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { contractAddress } = req.body

    try {
      // Call GeckoTerminal API here
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/tron/tokens/${contractAddress}`)
      if (!response.ok) throw new Error('Failed to fetch token data')
      const data = await response.json()

      // Process and return the data
      res.status(200).json({
        name: data.name,
        symbol: data.symbol,
        liquidity: data.liquidity,
        holders: data.holders,
        marketCap: data.market_cap,
        socialAccounts: data.social_accounts
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify token' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}