import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";

// GitHubトークンは環境変数から取得します（リポジトリに直書きしないため）
const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!githubToken) {
  throw new Error("Missing env var: GITHUB_PERSONAL_ACCESS_TOKEN");
}
const octokit = new Octokit({ auth: githubToken });

const server = new Server(
  { name: "github-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 1. ツールの一覧を定義
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_my_repositories",
      description: "自分のGitHubリポジトリ一覧を取得します",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

// 2. ツールの実行ロジックを定義
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_my_repositories") {
    const { data } = await octokit.repos.listForAuthenticatedUser();
    const names = data.map(repo => repo.full_name).join("\n");
    return { content: [{ type: "text", text: `リポジトリ一覧:\n${names}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("GitHub MCP Server Ready!");