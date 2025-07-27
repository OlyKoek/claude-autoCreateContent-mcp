#!/usr/bin/env node

import { createDraftArticle } from "./tools/qiita";
import { z } from "zod";

const MCPRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]).nullable().optional(),
  method: z.string(),
  params: z.optional(z.any())
}).passthrough();

interface MCPRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: string;
  id: number | string | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Simple MCP Server implementation
class SimpleMCPServer {
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {

    try {
      MCPRequestSchema.parse(request);
    } catch (zodError) {
      return {
        jsonrpc: "2.0",
        id: request?.id ?? null,
        error: {
          code: -32600,
          message: "Invalid Request Format",
          data: zodError,
        },
      };
    }

    // リクエストの基本的な検証
    if (!request.jsonrpc || !request.method) {
      return {
        jsonrpc: "2.0",
        id: request.id || null,
        error: {
          code: -32600,
          message: "Invalid Request: jsonrpc and method are required"
        }
      };
    }

    try {
      switch (request.method) {
        case "initialize": // Response for initialization
          return {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {}
              },
              serverInfo: {
                name: "qiita-mcp-server",
                version: "1.0.0"
              }
            }
          };

        case "tools/list": // Response for listing available tools
          return {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              tools: [
                {
                  name: "create_qiita_article",
                  description: "Qiita記事を作成する（private: trueで非公開記事として作成）",
                  inputSchema: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      body: { type: "string" },
                      tags: { type: "array", items: { type: "string" } },
                      private: { type: "boolean", default: true }
                    },
                    required: ["title", "body"]
                  }
                }
              ]
            }
          };

        case "tools/call": // Response for calling a tool
          const { name, arguments: args } = request.params;
          
          if (!args) {
            throw new Error("引数が提供されていません");
          }
          
          switch (name) {
            case "create_qiita_article":
              // 必須フィールドの検証
              if (!args.title || !args.body) {
                throw new Error("title と body は必須フィールドです");
              }
              
              // デフォルトで非公開記事として作成（private: true）
              const articleArgs = {
                ...args,
                private: args.private !== undefined ? args.private : true
              };
              
              const articleResult = await createDraftArticle(articleArgs);
              return {
                jsonrpc: "2.0",
                id: request.id,
                result: {
                  content: [
                    {
                      type: "text",
                      text: `Qiita記事が作成されました。ID: ${articleResult.draft_id}, URL: ${articleResult.url}`
                    }
                  ]
                }
              };

            default:
              throw new Error(`Unknown tool: ${name}`);
          }

        default:
          throw new Error(`Unknown method: ${request.method}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        jsonrpc: "2.0",
        id: request.id || null,
        error: {
          code: -32000,
          message: errorMessage
        }
      };
    }
  }


  /*
   * Start the MCP server
   * Reads from stdin and writes to stdout
   */
  start() {
    // ログは標準エラー出力に出力
    process.stderr.write("Qiita MCP Server starting...\n");
    
    process.stdin.setEncoding('utf8');
    
    let buffer = '';
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const request: MCPRequest = JSON.parse(line);
            // デバッグ: 受信したリクエストをログ出力
            process.stderr.write(`🔥 受信リクエスト: ${JSON.stringify(request, null, 2)}\n`);
            
            const response = await this.handleRequest(request);
            // デバッグ: 送信するレスポンスをログ出力
            process.stderr.write(`📤 送信レスポンス: ${JSON.stringify(response, null, 2)}\n`);
            
            // MCPレスポンスは標準出力に出力（Claude Desktopが読み取る）
            process.stdout.write(JSON.stringify(response) + '\n');
          } catch (parseError) {
            // パースエラーの場合も適切なJSON-RPCエラーレスポンスを返す
            const errorResponse = {
              jsonrpc: "2.0",
              id: null,
              error: {
                code: -32700,
                message: `Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`
              }
            };
            
            process.stderr.write(`❌ パースエラー: ${JSON.stringify(errorResponse, null, 2)}\n`);
            process.stdout.write(JSON.stringify(errorResponse) + '\n');
          }
        }
      }
    });
    
    process.stdin.on('end', () => {
      process.exit(0);
    });
  }
}

const server = new SimpleMCPServer();
server.start();