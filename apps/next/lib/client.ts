export class ApiClient {
  constructor(private baseUrl: string) {}

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return { data }
  }
} 