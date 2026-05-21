
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "PC Hardware Ecommerce API",
      "version": "1.0.0",
      "description": "API docs for PC Hardware Ecommerce App Server"
    },
    "servers": [
      {
        "url": "http://localhost:3000/api",
        "description": "Main API Server"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "paths": {
      "/admin/brands": {
        "post": {
          "summary": "Tạo thương hiệu mới",
          "description": "Tạo thương hiệu mới bằng file logo. Không chấp nhận logo_url dạng chuỗi. Chỉ admin.",
          "tags": [
            "Admin Brands"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name",
                    "logo"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "ASUS"
                    },
                    "logo": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo thương hiệu thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ, thiếu file logo hoặc tên đã tồn tại"
            }
          }
        }
      },
      "/admin/brands/{id}": {
        "put": {
          "summary": "Cập nhật thương hiệu",
          "description": "Cập nhật thương hiệu theo id. Field logo là optional, nếu gửi logo mới sẽ thay thế logo cũ. Chỉ admin.",
          "tags": [
            "Admin Brands"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "ASUS ROG"
                    },
                    "logo": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật thương hiệu thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ, thiếu file logo hoặc thương hiệu không tồn tại"
            }
          }
        },
        "delete": {
          "summary": "Xóa thương hiệu",
          "description": "Xóa thương hiệu theo id. Chỉ admin.",
          "tags": [
            "Admin Brands"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa thương hiệu thành công"
            },
            "400": {
              "description": "ID không hợp lệ hoặc thương hiệu không tồn tại"
            }
          }
        }
      },
      "/admin/categories": {
        "post": {
          "summary": "Tạo danh mục mới",
          "description": "Tạo danh mục mới. Chỉ admin.",
          "tags": [
            "Admin Categories"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "Mainboard"
                    },
                    "slug": {
                      "type": "string",
                      "example": "mainboard"
                    },
                    "description": {
                      "type": "string",
                      "example": "Danh mục bo mạch chủ"
                    },
                    "parent_id": {
                      "type": "integer",
                      "nullable": true,
                      "example": null
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo danh mục thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/admin/categories/{id}": {
        "put": {
          "summary": "Cập nhật danh mục",
          "description": "Cập nhật danh mục theo id. Chỉ admin.",
          "tags": [
            "Admin Categories"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "Mainboard Intel"
                    },
                    "slug": {
                      "type": "string",
                      "example": "mainboard-intel"
                    },
                    "description": {
                      "type": "string",
                      "example": "Danh mục bo mạch chủ Intel"
                    },
                    "parent_id": {
                      "type": "integer",
                      "nullable": true,
                      "example": 1
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật danh mục thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc danh mục không tồn tại"
            }
          }
        },
        "delete": {
          "summary": "Xóa danh mục",
          "description": "Xóa danh mục theo id. Chỉ admin.",
          "tags": [
            "Admin Categories"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa danh mục thành công"
            },
            "400": {
              "description": "ID không hợp lệ hoặc danh mục không tồn tại"
            }
          }
        }
      },
      "/admin/coupons": {
        "get": {
          "summary": "Danh sách coupon",
          "description": "Lấy danh sách tất cả coupon, hỗ trợ lọc theo trạng thái. Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "is_active",
              "required": false,
              "schema": {
                "type": "boolean"
              },
              "description": "Lọc theo trạng thái kích hoạt (true/false)"
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        },
        "post": {
          "summary": "Tạo coupon mới",
          "description": "Tạo một coupon mới. Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "code",
                    "discount_type",
                    "discount_value"
                  ],
                  "properties": {
                    "code": {
                      "type": "string",
                      "example": "SUMMER2024",
                      "description": "Mã coupon (unique, sẽ tự động chuyển thành uppercase)"
                    },
                    "discount_type": {
                      "type": "string",
                      "enum": [
                        "percent",
                        "fixed"
                      ],
                      "example": "percent",
                      "description": "Loại giảm giá"
                    },
                    "discount_value": {
                      "type": "number",
                      "format": "decimal",
                      "example": 10,
                      "description": "Giá trị giảm (%, 0-100 nếu percent; hoặc số tiền nếu fixed)"
                    },
                    "min_order_value": {
                      "type": "number",
                      "format": "decimal",
                      "nullable": true,
                      "example": 100000,
                      "description": "Giá trị đơn hàng tối thiểu"
                    },
                    "max_uses": {
                      "type": "integer",
                      "nullable": true,
                      "example": 50,
                      "description": "Số lần sử dụng tối đa"
                    },
                    "expires_at": {
                      "type": "string",
                      "format": "date-time",
                      "nullable": true,
                      "example": "2024-12-31T23:59:59Z",
                      "description": "Ngày hết hạn (ISO 8601)"
                    },
                    "is_active": {
                      "type": "boolean",
                      "nullable": true,
                      "example": true,
                      "description": "Kích hoạt ngay (mặc định true)"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc mã coupon đã tồn tại"
            }
          }
        }
      },
      "/admin/coupons/{id}": {
        "get": {
          "summary": "Chi tiết coupon",
          "description": "Lấy thông tin chi tiết một coupon theo ID. Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc coupon không tồn tại"
            }
          }
        },
        "put": {
          "summary": "Cập nhật coupon",
          "description": "Cập nhật thông tin coupon. Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "code": {
                      "type": "string",
                      "example": "SUMMER2024_V2"
                    },
                    "discount_type": {
                      "type": "string",
                      "enum": [
                        "percent",
                        "fixed"
                      ]
                    },
                    "discount_value": {
                      "type": "number",
                      "format": "decimal",
                      "example": 15
                    },
                    "min_order_value": {
                      "type": "number",
                      "format": "decimal",
                      "nullable": true
                    },
                    "max_uses": {
                      "type": "integer",
                      "nullable": true
                    },
                    "expires_at": {
                      "type": "string",
                      "format": "date-time",
                      "nullable": true
                    },
                    "is_active": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc coupon không tồn tại"
            }
          }
        },
        "delete": {
          "summary": "Xóa coupon",
          "description": "Xóa một coupon. Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc coupon không tồn tại"
            }
          }
        }
      },
      "/admin/coupons/{id}/status": {
        "patch": {
          "summary": "Bật/tắt coupon",
          "description": "Chuyển đổi trạng thái kích hoạt của coupon (true -> false, false -> true). Chỉ admin.",
          "tags": [
            "Admin Coupons"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Chuyển đổi trạng thái coupon thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc coupon không tồn tại"
            }
          }
        }
      },
      "/admin/orders": {
        "get": {
          "summary": "Danh sách tất cả đơn hàng",
          "description": "Lấy danh sách đơn hàng với bộ lọc status, payment_status, user_id, date_from, date_to, search. **Chỉ admin**",
          "tags": [
            "Admin Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "status",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "payment_status",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "user_id",
              "required": false,
              "schema": {
                "type": "integer"
              }
            },
            {
              "in": "query",
              "name": "date_from",
              "required": false,
              "schema": {
                "type": "string",
                "example": "2024-01-01"
              }
            },
            {
              "in": "query",
              "name": "date_to",
              "required": false,
              "schema": {
                "type": "string",
                "example": "2024-01-31"
              }
            },
            {
              "in": "query",
              "name": "search",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách đơn hàng thành công"
            }
          }
        }
      },
      "/admin/orders/{id}": {
        "get": {
          "summary": "Chi tiết đơn hàng",
          "tags": [
            "Admin Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết đơn hàng thành công"
            }
          }
        }
      },
      "/admin/orders/{id}/status": {
        "patch": {
          "summary": "Cập nhật trạng thái đơn hàng",
          "tags": [
            "Admin Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "order_status"
                  ],
                  "properties": {
                    "order_status": {
                      "type": "string",
                      "example": "confirmed"
                    },
                    "note": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật trạng thái thành công"
            }
          }
        }
      },
      "/admin/orders/{id}/cancel": {
        "patch": {
          "summary": "Hủy đơn hàng (Admin, có lý do)",
          "tags": [
            "Admin Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "cancel_reason"
                  ],
                  "properties": {
                    "cancel_reason": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Hủy đơn hàng thành công"
            }
          }
        }
      },
      "/admin/orders/{id}/status-logs": {
        "get": {
          "summary": "Lịch sử thay đổi trạng thái đơn hàng",
          "tags": [
            "Admin Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy lịch sử trạng thái thành công"
            }
          }
        }
      },
      "/admin/product-images/{id}": {
        "delete": {
          "summary": "Xóa ảnh sản phẩm",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa ảnh thành công"
            },
            "400": {
              "description": "Ảnh không tồn tại hoặc không thể xóa"
            }
          }
        }
      },
      "/admin/product-images/{id}/primary": {
        "patch": {
          "summary": "Đặt ảnh làm ảnh chính",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Đặt ảnh chính thành công"
            },
            "400": {
              "description": "Ảnh không tồn tại hoặc không hợp lệ"
            }
          }
        }
      },
      "/admin/products": {
        "get": {
          "summary": "Danh sách sản phẩm cho admin (có phân trang + lọc)",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "integer",
                "example": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "example": 20
              }
            },
            {
              "in": "query",
              "name": "keyword",
              "schema": {
                "type": "string",
                "example": "\\\"laptop\\\""
              }
            },
            {
              "in": "query",
              "name": "category_id",
              "schema": {
                "type": "integer",
                "example": 1
              }
            },
            {
              "in": "query",
              "name": "brand_id",
              "schema": {
                "type": "integer",
                "example": 2
              }
            },
            {
              "in": "query",
              "name": "price_min",
              "schema": {
                "type": "number",
                "example": 10000000
              }
            },
            {
              "in": "query",
              "name": "price_max",
              "schema": {
                "type": "number",
                "example": 30000000
              }
            },
            {
              "in": "query",
              "name": "status",
              "schema": {
                "type": "string",
                "enum": [
                  "available",
                  "out_of_stock",
                  "discontinued"
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách sản phẩm thành công"
            },
            "400": {
              "description": "Tham số không hợp lệ hoặc lỗi khi lấy dữ liệu"
            }
          }
        },
        "post": {
          "summary": "Tạo sản phẩm mới",
          "description": "Tạo sản phẩm mới (chưa tạo biến thể). Chỉ admin.",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "sku",
                    "name",
                    "category_id",
                    "brand_id"
                  ],
                  "properties": {
                    "sku": {
                      "type": "string",
                      "example": "PRD-001"
                    },
                    "name": {
                      "type": "string",
                      "example": "Laptop Gaming XYZ"
                    },
                    "description": {
                      "type": "string",
                      "nullable": true
                    },
                    "category_id": {
                      "type": "integer",
                      "example": 1
                    },
                    "brand_id": {
                      "type": "integer",
                      "example": 2
                    },
                    "specifications": {
                      "type": "object",
                      "nullable": true,
                      "example": {
                        "cpu": "Intel Core i7",
                        "ram": "16GB"
                      }
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "available",
                        "out_of_stock",
                        "discontinued"
                      ],
                      "example": "available"
                    },
                    "product_images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      },
                      "description": "Up to 8 product images"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo sản phẩm thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc tạo sản phẩm thất bại"
            }
          }
        }
      },
      "/admin/products/{id}/images": {
        "post": {
          "summary": "Upload ảnh sản phẩm",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "images"
                  ],
                  "properties": {
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tải ảnh sản phẩm thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc vượt quá giới hạn ảnh"
            }
          }
        }
      },
      "/admin/products/{id}": {
        "put": {
          "summary": "Cập nhật thông tin sản phẩm (không cập nhật variant)",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sku": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string",
                      "nullable": true
                    },
                    "category_id": {
                      "type": "integer"
                    },
                    "brand_id": {
                      "type": "integer"
                    },
                    "specifications": {
                      "type": "object",
                      "nullable": true
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật sản phẩm thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc sản phẩm không tồn tại"
            }
          }
        },
        "delete": {
          "summary": "Xóa sản phẩm",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa sản phẩm thành công"
            },
            "400": {
              "description": "Sản phẩm không tồn tại hoặc không thể xóa"
            }
          }
        }
      },
      "/admin/products/{id}/status": {
        "patch": {
          "summary": "Thay đổi trạng thái sản phẩm",
          "tags": [
            "Admin Products"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "status"
                  ],
                  "properties": {
                    "status": {
                      "type": "string",
                      "enum": [
                        "available",
                        "out_of_stock",
                        "discontinued"
                      ]
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật trạng thái sản phẩm thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc sản phẩm không tồn tại"
            }
          }
        }
      },
      "/admin/products/{id}/variants": {
        "post": {
          "summary": "Thêm variant mới cho sản phẩm",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "sku",
                    "price",
                    "stock",
                    "variant_image"
                  ],
                  "properties": {
                    "sku": {
                      "type": "string"
                    },
                    "version": {
                      "type": "string"
                    },
                    "color": {
                      "type": "string"
                    },
                    "color_hex": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "compare_at_price": {
                      "type": "number",
                      "nullable": true
                    },
                    "stock": {
                      "type": "integer"
                    },
                    "is_active": {
                      "type": "boolean"
                    },
                    "variant_image": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Thêm biến thể thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc tạo biến thể thất bại"
            }
          }
        },
        "get": {
          "summary": "Danh sách variants của sản phẩm",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách biến thể thành công"
            },
            "400": {
              "description": "Sản phẩm không tồn tại hoặc lỗi dữ liệu"
            }
          }
        }
      },
      "/admin/return-requests": {
        "get": {
          "summary": "Danh sách tất cả yêu cầu trả hàng",
          "description": "Lấy danh sách tất cả yêu cầu trả hàng trong hệ thống.\nHỗ trợ filter theo `status`.\nDữ liệu trả về gồm thông tin request, user tạo request, và danh sách `return_items`\nđã join sang product, variant và ảnh variant.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "status",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "pending",
                  "approved",
                  "rejected",
                  "received",
                  "completed"
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "integer",
                              "example": 10
                            },
                            "order_id": {
                              "type": "integer",
                              "example": 123
                            },
                            "user": {
                              "type": "object",
                              "properties": {
                                "id": {
                                  "type": "integer",
                                  "example": 8
                                },
                                "full_name": {
                                  "type": "string",
                                  "example": "Nguyen Van A"
                                },
                                "email": {
                                  "type": "string",
                                  "example": "customer@example.com"
                                },
                                "phone_number": {
                                  "type": "string",
                                  "nullable": true,
                                  "example": "0901234567"
                                }
                              }
                            },
                            "reason": {
                              "type": "string",
                              "example": "Sản phẩm bị lỗi khi nhận hàng"
                            },
                            "status": {
                              "type": "string",
                              "enum": [
                                "pending",
                                "approved",
                                "rejected",
                                "received",
                                "completed"
                              ],
                              "example": "pending"
                            },
                            "admin_note": {
                              "type": "string",
                              "nullable": true,
                              "example": null
                            },
                            "refund_amount": {
                              "type": "number",
                              "format": "decimal",
                              "example": 25990000
                            },
                            "created_at": {
                              "type": "string",
                              "format": "date-time",
                              "example": "2026-04-21T10:00:00.000Z"
                            },
                            "return_items": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "id": {
                                    "type": "integer",
                                    "example": 100
                                  },
                                  "name": {
                                    "type": "string",
                                    "example": "RTX 4070 SUPER"
                                  },
                                  "slug": {
                                    "type": "string",
                                    "example": "rtx-4070-super"
                                  },
                                  "variant": {
                                    "type": "object",
                                    "properties": {
                                      "id": {
                                        "type": "integer",
                                        "example": 5
                                      },
                                      "version": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "12GB GDDR6X"
                                      },
                                      "color": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "Black"
                                      },
                                      "color_hex": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "#111111"
                                      },
                                      "image_url": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                      }
                                    }
                                  },
                                  "quantity": {
                                    "type": "integer",
                                    "example": 1
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Tham số không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "status không hợp lệ"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/return-requests/{id}": {
        "get": {
          "summary": "Chi tiết yêu cầu trả hàng",
          "description": "Lấy chi tiết một yêu cầu trả hàng.\nResponse bao gồm thông tin request, user tạo request, danh sách `return_items`,\ndanh sách ảnh minh chứng và địa chỉ giao hàng của đơn gốc.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "order_id": {
                            "type": "integer",
                            "example": 123
                          },
                          "user": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer",
                                "example": 8
                              },
                              "full_name": {
                                "type": "string",
                                "example": "Nguyen Van A"
                              },
                              "email": {
                                "type": "string",
                                "example": "customer@example.com"
                              },
                              "phone_number": {
                                "type": "string",
                                "nullable": true,
                                "example": "0901234567"
                              }
                            }
                          },
                          "reason": {
                            "type": "string",
                            "example": "Sản phẩm bị lỗi khi nhận hàng"
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "pending"
                          },
                          "admin_note": {
                            "type": "string",
                            "nullable": true,
                            "example": "Đang chờ kiểm tra"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "example": 25990000
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2026-04-21T10:00:00.000Z"
                          },
                          "return_items": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "id": {
                                  "type": "integer",
                                  "example": 100
                                },
                                "product_id": {
                                  "type": "integer",
                                  "example": 20
                                },
                                "name": {
                                  "type": "string",
                                  "example": "RTX 4070 SUPER"
                                },
                                "slug": {
                                  "type": "string",
                                  "example": "rtx-4070-super"
                                },
                                "variant": {
                                  "type": "object",
                                  "properties": {
                                    "id": {
                                      "type": "integer",
                                      "example": 5
                                    },
                                    "version": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "12GB GDDR6X"
                                    },
                                    "color": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "Black"
                                    },
                                    "color_hex": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "#111111"
                                    },
                                    "image_url": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                    }
                                  }
                                },
                                "quantity": {
                                  "type": "integer",
                                  "example": 1
                                },
                                "condition": {
                                  "type": "string",
                                  "enum": [
                                    "good",
                                    "damaged",
                                    "wrong_item"
                                  ],
                                  "example": "damaged"
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "decimal",
                                  "example": 25990000
                                }
                              }
                            }
                          },
                          "images": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "id": {
                                  "type": "integer",
                                  "example": 1
                                },
                                "image_url": {
                                  "type": "string",
                                  "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                }
                              }
                            }
                          },
                          "address": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer",
                                "example": 12
                              },
                              "recipient": {
                                "type": "string",
                                "example": "Nguyen Van A"
                              },
                              "phone_number": {
                                "type": "string",
                                "example": "0901234567"
                              },
                              "province": {
                                "type": "string",
                                "example": "Ho Chi Minh"
                              },
                              "district": {
                                "type": "string",
                                "example": "District 1"
                              },
                              "ward": {
                                "type": "string",
                                "example": "Ben Nghe"
                              },
                              "street": {
                                "type": "string",
                                "example": "123 Le Loi"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "ID không hợp lệ hoặc yêu cầu không tồn tại",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Yêu cầu trả hàng không tồn tại"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/return-requests/{id}/approve": {
        "patch": {
          "summary": "Duyệt yêu cầu trả hàng",
          "description": "Duyệt yêu cầu trả hàng.\nAPI tự động đặt `refund_amount = total` của đơn hàng gốc, cập nhật `admin_note` (nếu có),\nvà chuyển trạng thái request từ `pending` sang `approved`.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "admin_note": {
                      "type": "string",
                      "nullable": true,
                      "description": "Ghi chú duyệt của admin",
                      "example": "Đã kiểm tra, chấp nhận hoàn tiền"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Duyệt yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "approved"
                          },
                          "admin_note": {
                            "type": "string",
                            "nullable": true,
                            "example": "Đã kiểm tra, chấp nhận hoàn tiền"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "description": "Tự động lấy bằng tổng tiền của đơn hàng",
                            "example": 25990000
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Duyệt yêu cầu trả hàng thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc trạng thái không cho phép",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Chỉ có thể duyệt yêu cầu đang ở trạng thái pending"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/return-requests/{id}/reject": {
        "patch": {
          "summary": "Từ chối yêu cầu trả hàng",
          "description": "Từ chối yêu cầu trả hàng.\nAPI yêu cầu `admin_note` là lý do từ chối, đặt `refund_amount = 0`\nvà chuyển trạng thái request từ `pending` sang `rejected`.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "admin_note"
                  ],
                  "properties": {
                    "admin_note": {
                      "type": "string",
                      "description": "Lý do từ chối yêu cầu trả hàng",
                      "example": "Sản phẩm không thuộc điều kiện đổi trả"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Từ chối yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "rejected"
                          },
                          "admin_note": {
                            "type": "string",
                            "example": "Sản phẩm không thuộc điều kiện đổi trả"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "example": 0
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Từ chối yêu cầu trả hàng thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc trạng thái không cho phép",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "admin_note là bắt buộc"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/return-requests/{id}/received": {
        "patch": {
          "summary": "Xác nhận đã nhận hàng trả về",
          "description": "Xác nhận đã nhận hàng trả về.\nAPI cộng lại tồn kho cho từng variant trong request,\ntạo `StockLogs` mới cho từng variant, và chuyển trạng thái request từ `approved` sang `received`.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xác nhận nhận hàng trả về thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "received"
                          },
                          "admin_note": {
                            "type": "string",
                            "nullable": true,
                            "example": "Đã kiểm tra, chấp nhận hoàn tiền một phần"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "example": 19990000
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Xác nhận đã nhận hàng trả về thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "ID không hợp lệ hoặc trạng thái không cho phép",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Chỉ có thể xác nhận đã nhận hàng khi yêu cầu ở trạng thái approved"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/return-requests/{id}/refund": {
        "patch": {
          "summary": "Hoàn tiền cho đơn hàng trả hàng",
          "description": "Hoàn tiền cho đơn hàng liên quan đến yêu cầu trả hàng.\nAPI chuyển request từ `received` sang `completed`,\ncập nhật order liên quan sang `payment_status = refunded`, `order_status = cancelled`,\nset `cancel_reason`, tạo `OrderStatusLogs` mới nếu cần,\nvà cập nhật các payment thành `refunded` nếu đang ở trạng thái `success`.\n",
          "tags": [
            "Admin Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Hoàn tiền cho đơn hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "completed"
                          },
                          "order_id": {
                            "type": "integer",
                            "example": 123
                          },
                          "order_status": {
                            "type": "string",
                            "example": "cancelled"
                          },
                          "payment_status": {
                            "type": "string",
                            "example": "refunded"
                          },
                          "cancel_reason": {
                            "type": "string",
                            "example": "Hoàn tiền cho yêu cầu trả hàng #10"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Hoàn tiền cho đơn hàng thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "ID không hợp lệ hoặc trạng thái không cho phép",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Chỉ có thể hoàn tiền khi yêu cầu ở trạng thái received"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền admin",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/admin/stock/low-stock": {
        "get": {
          "summary": "Danh sách variant sắp hết hàng",
          "tags": [
            "Admin Stock"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "threshold",
              "schema": {
                "type": "integer",
                "example": 5
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách thành công"
            },
            "400": {
              "description": "Tham số không hợp lệ"
            }
          }
        }
      },
      "/admin/stock/inbound": {
        "post": {
          "summary": "Nhập hàng vào kho",
          "tags": [
            "Admin Stock"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "variant_id",
                      "change_qty"
                    ],
                    "properties": {
                      "variant_id": {
                        "type": "integer"
                      },
                      "change_qty": {
                        "type": "integer",
                        "description": "Số lượng nhập (số dương)"
                      },
                      "note": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Nhập kho thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/admin/stock/logs": {
        "get": {
          "summary": "Lịch sử nhập/xuất kho",
          "tags": [
            "Admin Stock"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "variant_id",
              "schema": {
                "type": "integer"
              }
            },
            {
              "in": "query",
              "name": "date",
              "schema": {
                "type": "string",
                "example": "2026-03-12"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy lịch sử thành công"
            },
            "400": {
              "description": "Tham số không hợp lệ"
            }
          }
        }
      },
      "/admin/users": {
        "get": {
          "summary": "Danh sách người dùng",
          "description": "Lấy danh sách người dùng với bộ lọc role, is_active, search. **Chỉ admin**",
          "tags": [
            "Admin Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "role",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "customer",
                  "admin"
                ]
              }
            },
            {
              "in": "query",
              "name": "is_active",
              "required": false,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "in": "query",
              "name": "search",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách thành công"
            },
            "401": {
              "description": "Chưa xác thực"
            },
            "403": {
              "description": "Không có quyền truy cập"
            }
          }
        }
      },
      "/admin/users/{id}": {
        "get": {
          "summary": "Chi tiết người dùng",
          "description": "Lấy thông tin chi tiết của một người dùng theo id. **Chỉ admin**",
          "tags": [
            "Admin Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết thành công"
            },
            "400": {
              "description": "ID không hợp lệ hoặc không tìm thấy người dùng"
            },
            "401": {
              "description": "Chưa xác thực"
            },
            "403": {
              "description": "Không có quyền truy cập"
            }
          }
        }
      },
      "/admin/users/{id}/status": {
        "patch": {
          "summary": "Khóa / Mở khóa tài khoản",
          "description": "Cập nhật trạng thái hoạt động của tài khoản người dùng. **Chỉ admin**",
          "tags": [
            "Admin Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "is_active"
                  ],
                  "properties": {
                    "is_active": {
                      "type": "boolean",
                      "description": "true = mở khóa, false = khóa tài khoản",
                      "example": false
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật trạng thái thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc không tìm thấy người dùng"
            },
            "401": {
              "description": "Chưa xác thực"
            },
            "403": {
              "description": "Không có quyền truy cập"
            }
          }
        }
      },
      "/admin/variants/{id}": {
        "put": {
          "summary": "Cập nhật variant",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sku": {
                      "type": "string"
                    },
                    "version": {
                      "type": "string"
                    },
                    "color": {
                      "type": "string"
                    },
                    "color_hex": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "compare_at_price": {
                      "type": "number",
                      "nullable": true
                    },
                    "stock": {
                      "type": "integer"
                    },
                    "variant_image": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật biến thể thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc biến thể không tồn tại"
            }
          }
        },
        "delete": {
          "summary": "Xóa variant",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa biến thể thành công"
            },
            "400": {
              "description": "Biến thể không tồn tại hoặc không thể xóa"
            }
          }
        }
      },
      "/admin/variants/{id}/image": {
        "patch": {
          "summary": "Cập nhật ảnh của variant",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "variant_image"
                  ],
                  "properties": {
                    "variant_image": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật ảnh biến thể thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc biến thể không tồn tại"
            }
          }
        }
      },
      "/admin/variants/{id}/status": {
        "patch": {
          "summary": "Bật/tắt variant",
          "tags": [
            "Admin Variants"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "is_active"
                  ],
                  "properties": {
                    "is_active": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật trạng thái biến thể thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc biến thể không tồn tại"
            }
          }
        }
      },
      "/auth/register": {
        "post": {
          "summary": "Đăng ký tài khoản mới",
          "description": "Tạo tài khoản mới. Hệ thống sẽ gửi mã xác thực 6 ký tự qua email để người dùng nhập trên ứng dụng.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "full_name",
                    "email",
                    "password"
                  ],
                  "properties": {
                    "full_name": {
                      "type": "string",
                      "example": "Nguyễn Văn A"
                    },
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    },
                    "phone_number": {
                      "type": "string",
                      "example": "0812345678"
                    },
                    "password": {
                      "type": "string",
                      "minLength": 8,
                      "example": "password123"
                    },
                    "address": {
                      "type": "object",
                      "required": [
                        "recipient",
                        "phone_number",
                        "province",
                        "district",
                        "ward",
                        "street",
                        "province_id",
                        "district_id",
                        "ward_code"
                      ],
                      "properties": {
                        "recipient": {
                          "type": "string",
                          "example": "Nguyễn Văn A"
                        },
                        "phone_number": {
                          "type": "string",
                          "example": "0812345678"
                        },
                        "province": {
                          "type": "string",
                          "example": "Hà Nội"
                        },
                        "district": {
                          "type": "string",
                          "example": "Quận Đống Đa"
                        },
                        "ward": {
                          "type": "string",
                          "example": "Phường Văn Chương"
                        },
                        "street": {
                          "type": "string",
                          "example": "123 Đường ABC"
                        },
                        "province_id": {
                          "type": "integer",
                          "example": 1
                        },
                        "district_id": {
                          "type": "integer",
                          "example": 1454
                        },
                        "ward_code": {
                          "type": "string",
                          "example": "21211"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Đăng ký thành công. Kiểm tra email để lấy mã xác thực.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Đăng ký thành công. Vui lòng kiểm tra email và nhập mã xác thực để kích hoạt tài khoản."
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi xác thực hoặc email đã tồn tại",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Email đã được sử dụng"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/verify-email": {
        "post": {
          "summary": "Xác thực email",
          "description": "Xác thực email người dùng bằng mã 6 ký tự được gửi qua email",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "code"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    },
                    "code": {
                      "type": "string",
                      "minLength": 6,
                      "maxLength": 6,
                      "example": "Ab3x9Q"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Xác thực email thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Xác thực email thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Mã xác thực không hợp lệ, sai hoặc đã hết hạn",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Mã xác thực không đúng"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/resend-verify-email": {
        "post": {
          "summary": "Gửi lại mã xác thực email",
          "description": "Xóa mã cũ trong Redis nếu có và gửi lại mã xác thực 6 ký tự mới qua email.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Gửi lại mã xác thực thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Gửi lại mã xác thực thành công. Vui lòng kiểm tra email của bạn."
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Email không tồn tại hoặc tài khoản đã được xác thực"
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "summary": "Đăng nhập bằng email và mật khẩu",
          "description": "Đăng nhập với email và mật khẩu. Access Token và Refresh Token sẽ được lưu trong cookie.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "password"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    },
                    "password": {
                      "type": "string",
                      "example": "password123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đăng nhập thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "access_token": {
                        "type": "string",
                        "description": "Access Token để sử dụng trong Authorization header",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "refresh_token": {
                        "type": "string",
                        "description": "Refresh Token để lấy access token mới",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "user": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 1
                          },
                          "full_name": {
                            "type": "string",
                            "example": "Nguyễn Văn A"
                          },
                          "email": {
                            "type": "string",
                            "example": "user@example.com"
                          },
                          "role": {
                            "type": "string",
                            "enum": [
                              "customer",
                              "admin"
                            ],
                            "example": "customer"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Email hoặc mật khẩu không đúng, hoặc tài khoản chưa verify",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Email hoặc mật khẩu không đúng"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/google": {
        "post": {
          "summary": "Đăng nhập / Đăng ký qua Google OAuth",
          "description": "Xác thực với Google ID token. Tạo tài khoản mới nếu email không tồn tại.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "id_token"
                  ],
                  "properties": {
                    "id_token": {
                      "type": "string",
                      "description": "Google ID Token từ Google Sign-In",
                      "example": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đăng nhập / Đăng ký thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "access_token": {
                        "type": "string",
                        "description": "Access Token để sử dụng trong Authorization header",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "refresh_token": {
                        "type": "string",
                        "description": "Refresh Token để lấy access token mới",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "user": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 2
                          },
                          "full_name": {
                            "type": "string",
                            "example": "Nguyễn Văn B"
                          },
                          "email": {
                            "type": "string",
                            "example": "user@gmail.com"
                          },
                          "role": {
                            "type": "string",
                            "example": "customer"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "ID token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "ID token không hợp lệ"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/refresh": {
        "post": {
          "summary": "Làm mới Access Token",
          "description": "Lấy Access Token mới từ Refresh Token. Gửi refresh token trong request body.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "refresh_token"
                  ],
                  "properties": {
                    "refresh_token": {
                      "type": "string",
                      "description": "Refresh Token từ đăng nhập hoặc refresh token trước đó",
                      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Lấy Access Token mới thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "access_token": {
                        "type": "string",
                        "description": "Access Token mới",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "message": {
                        "type": "string",
                        "example": "Token đã được làm mới"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Refresh Token không được cung cấp",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Refresh token không được cung cấp"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Refresh Token không hợp lệ hoặc đã hết hạn",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/forgot-password": {
        "post": {
          "summary": "Gửi mã đặt lại mật khẩu",
          "description": "Nếu email tồn tại trong hệ thống, server sẽ gửi mã đặt lại mật khẩu 6 ký tự qua email.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Yêu cầu gửi mã đặt lại mật khẩu đã được xử lý",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/verify-reset-password-code": {
        "post": {
          "summary": "Xác thực mã đặt lại mật khẩu",
          "description": "Kiểm tra mã đặt lại mật khẩu 6 ký tự và trả về reset token ngắn hạn nếu hợp lệ.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "code"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "user@example.com"
                    },
                    "code": {
                      "type": "string",
                      "minLength": 6,
                      "maxLength": 6,
                      "example": "Ab3x9Q"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Xác thực mã thành công và trả về token đặt lại mật khẩu",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "reset_token": {
                        "type": "string",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      },
                      "message": {
                        "type": "string",
                        "example": "Xác thực mã đặt lại mật khẩu thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Mã không hợp lệ, sai hoặc đã hết hạn"
            }
          }
        }
      },
      "/auth/reset-password": {
        "post": {
          "summary": "Đặt lại mật khẩu mới",
          "description": "Sử dụng reset token ở query param và mật khẩu mới trong request body để cập nhật mật khẩu.",
          "tags": [
            "Auth"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "token",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Reset token được trả về từ API xác thực mã đặt lại mật khẩu",
              "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "new_password"
                  ],
                  "properties": {
                    "new_password": {
                      "type": "string",
                      "minLength": 8,
                      "description": "Mật khẩu mới (tối thiểu 8 ký tự)",
                      "example": "newpassword123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đặt lại mật khẩu thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Đặt lại mật khẩu thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Token không hợp lệ hoặc đã hết hạn",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "summary": "Đăng xuất",
          "description": "Đăng xuất tài khoản hiện tại. Cần xác thực bằng Access Token (Authorization header).",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "BearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "refresh_token"
                  ],
                  "properties": {
                    "refresh_token": {
                      "type": "string",
                      "description": "Refresh Token cần được invalidate khi đăng xuất",
                      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đăng xuất thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Đăng xuất thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Refresh Token không được cung cấp",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Refresh token không được để trống"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Không được xác thực",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không được cung cấp"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/reset-password-user": {
        "post": {
          "summary": "Đặt lại mật khẩu (người dùng đã authenticated)",
          "description": "Cho phép người dùng đã đăng nhập thay đổi mật khẩu của mình bằng cách cung cấp mật khẩu cũ và mật khẩu mới. Cần xác thực bằng Access Token (Authorization header).",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "BearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "old_password",
                    "new_password"
                  ],
                  "properties": {
                    "old_password": {
                      "type": "string",
                      "minLength": 8,
                      "description": "Mật khẩu cũ hiện tại",
                      "example": "oldpassword123"
                    },
                    "new_password": {
                      "type": "string",
                      "minLength": 8,
                      "description": "Mật khẩu mới (tối thiểu 8 ký tự)",
                      "example": "newpassword123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đặt lại mật khẩu thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Đặt lại mật khẩu thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Mật khẩu cũ không đúng hoặc mật khẩu mới trùng với cũ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Mật khẩu cũ không đúng"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Không được xác thực",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không được cung cấp"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/brands": {
        "get": {
          "summary": "Danh sách thương hiệu",
          "description": "Lấy toàn bộ danh sách thương hiệu",
          "tags": [
            "Brands"
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách thương hiệu thành công"
            },
            "400": {
              "description": "Lỗi khi lấy danh sách thương hiệu"
            }
          }
        }
      },
      "/brands/{id}": {
        "get": {
          "summary": "Chi tiết thương hiệu",
          "description": "Lấy thông tin chi tiết thương hiệu theo id",
          "tags": [
            "Brands"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết thương hiệu thành công"
            },
            "400": {
              "description": "ID không hợp lệ hoặc thương hiệu không tồn tại"
            }
          }
        }
      },
      "/cart": {
        "get": {
          "summary": "Lấy giỏ hàng hiện tại (bao gồm items + tổng tiền)",
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy giỏ hàng thành công"
            },
            "401": {
              "description": "Token không hợp lệ hoặc đã hết hạn"
            }
          }
        },
        "delete": {
          "summary": "Xóa toàn bộ giỏ hàng",
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa giỏ hàng thành công"
            }
          }
        }
      },
      "/cart/items": {
        "post": {
          "summary": "Thêm sản phẩm vào giỏ",
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "variant_id",
                    "quantity"
                  ],
                  "properties": {
                    "variant_id": {
                      "type": "integer",
                      "example": 1
                    },
                    "quantity": {
                      "type": "integer",
                      "example": 1
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Thêm sản phẩm thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/cart/items/{variant_id}": {
        "put": {
          "summary": "Cập nhật số lượng sản phẩm trong giỏ",
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "variant_id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "quantity"
                  ],
                  "properties": {
                    "quantity": {
                      "type": "integer",
                      "example": 2
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật số lượng thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        },
        "delete": {
          "summary": "Xóa sản phẩm khỏi giỏ",
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "variant_id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa sản phẩm khỏi giỏ thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/categories": {
        "get": {
          "summary": "Lấy toàn bộ danh mục (dạng cây)",
          "description": "Trả về danh sách danh mục dạng cây (parent -> children)",
          "tags": [
            "Categories"
          ],
          "responses": {
            "200": {
              "description": "Lấy danh mục thành công"
            },
            "400": {
              "description": "Lỗi khi lấy danh mục"
            }
          }
        }
      },
      "/categories/{id}": {
        "get": {
          "summary": "Chi tiết danh mục",
          "description": "Trả về thông tin chi tiết danh mục theo id, bao gồm cây con của danh mục đó",
          "tags": [
            "Categories"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết danh mục thành công"
            },
            "400": {
              "description": "ID không hợp lệ hoặc danh mục không tồn tại"
            }
          }
        }
      },
      "/coupons": {
        "get": {
          "summary": "Danh sách coupon đang hoạt động",
          "description": "Lấy danh sách tất cả coupon đang hoạt động (is_active = true).",
          "tags": [
            "Coupons"
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách coupon thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "integer",
                              "example": 1
                            },
                            "code": {
                              "type": "string",
                              "example": "SUMMER2024"
                            },
                            "discount_type": {
                              "type": "string",
                              "enum": [
                                "percent",
                                "fixed"
                              ],
                              "example": "percent"
                            },
                            "discount_value": {
                              "type": "number",
                              "format": "decimal",
                              "example": 10
                            },
                            "min_order_value": {
                              "type": "number",
                              "format": "decimal",
                              "nullable": true,
                              "example": 100000
                            },
                            "max_uses": {
                              "type": "integer",
                              "nullable": true,
                              "example": 50
                            },
                            "used_count": {
                              "type": "integer",
                              "example": 15
                            },
                            "expires_at": {
                              "type": "string",
                              "format": "date-time",
                              "nullable": true,
                              "example": "2024-12-31T23:59:59Z"
                            },
                            "is_active": {
                              "type": "boolean",
                              "example": true
                            },
                            "created_at": {
                              "type": "string",
                              "format": "date-time",
                              "example": "2024-01-01T00:00:00Z"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/orders": {
        "post": {
          "summary": "Tạo đơn hàng mới từ giỏ hàng",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "address_id",
                    "payment_method",
                    "items"
                  ],
                  "properties": {
                    "address_id": {
                      "type": "integer"
                    },
                    "coupon_id": {
                      "type": "integer"
                    },
                    "payment_method": {
                      "type": "string",
                      "example": "cod"
                    },
                    "note": {
                      "type": "string"
                    },
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": [
                          "variant_id",
                          "quantity"
                        ],
                        "properties": {
                          "variant_id": {
                            "type": "integer"
                          },
                          "quantity": {
                            "type": "integer"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo đơn hàng thành công"
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        },
        "get": {
          "summary": "Danh sách đơn hàng của tôi",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "order_status",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "payment_status",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách đơn hàng thành công"
            }
          }
        }
      },
      "/orders/shipment-fee": {
        "post": {
          "summary": "Tính phí vận chuyển theo địa chỉ",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "address_id"
                  ],
                  "properties": {
                    "address_id": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Tính phí vận chuyển thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "shipping_fee": {
                            "type": "number",
                            "example": 30000
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dữ liệu không hợp lệ"
            }
          }
        }
      },
      "/orders/{id}": {
        "get": {
          "summary": "Chi tiết đơn hàng",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết đơn hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer"
                              },
                              "recipient": {
                                "type": "string"
                              },
                              "phone_number": {
                                "type": "string"
                              },
                              "province": {
                                "type": "string"
                              },
                              "district": {
                                "type": "string"
                              },
                              "ward": {
                                "type": "string"
                              },
                              "street": {
                                "type": "string"
                              },
                              "province_id": {
                                "type": "integer"
                              },
                              "district_id": {
                                "type": "integer"
                              },
                              "ward_code": {
                                "type": "string"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/orders/{id}/cancel": {
        "patch": {
          "summary": "Hủy đơn hàng (chỉ khi status = pending)",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "cancel_reason"
                  ],
                  "properties": {
                    "cancel_reason": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Hủy đơn hàng thành công"
            }
          }
        }
      },
      "/orders/{id}/confirm-received": {
        "patch": {
          "summary": "Xác nhận đã nhận hàng (khi status = delivered)",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Xác nhận đã nhận hàng thành công"
            }
          }
        }
      },
      "/payments/webhook": {
        "post": {
          "summary": "Nhận webhook thanh toán từ PayOS",
          "description": "Endpoint để PayOS gửi trạng thái thanh toán về server và đồng bộ trạng thái payment/order.",
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "code",
                    "desc",
                    "success",
                    "data",
                    "signature"
                  ],
                  "properties": {
                    "code": {
                      "type": "string",
                      "description": "Mã phản hồi của PayOS cho webhook.",
                      "example": "00"
                    },
                    "desc": {
                      "type": "string",
                      "description": "Mô tả phản hồi webhook từ PayOS.",
                      "example": "success"
                    },
                    "success": {
                      "type": "boolean",
                      "description": "Kết quả xử lý webhook phía PayOS.",
                      "example": true
                    },
                    "data": {
                      "type": "object",
                      "required": [
                        "orderCode",
                        "amount",
                        "description",
                        "accountNumber",
                        "reference",
                        "transactionDateTime",
                        "currency",
                        "paymentLinkId",
                        "code",
                        "desc"
                      ],
                      "properties": {
                        "orderCode": {
                          "type": "integer",
                          "description": "Mã payment nội bộ được truyền sang PayOS.",
                          "example": 12345
                        },
                        "amount": {
                          "type": "number",
                          "description": "Số tiền giao dịch.",
                          "example": 500000
                        },
                        "description": {
                          "type": "string",
                          "description": "Nội dung thanh toán.",
                          "example": "DH1-TT12345"
                        },
                        "accountNumber": {
                          "type": "string",
                          "description": "Số tài khoản nhận tiền.",
                          "example": "1234567890"
                        },
                        "reference": {
                          "type": "string",
                          "description": "Mã tham chiếu giao dịch.",
                          "example": "FT25123456789"
                        },
                        "transactionDateTime": {
                          "type": "string",
                          "format": "date-time",
                          "description": "Thời gian phát sinh giao dịch.",
                          "example": "2026-05-20T10:30:00Z"
                        },
                        "currency": {
                          "type": "string",
                          "description": "Loại tiền tệ.",
                          "example": "VND"
                        },
                        "paymentLinkId": {
                          "type": "string",
                          "description": "ID payment link phía PayOS.",
                          "example": "plink_123456"
                        },
                        "code": {
                          "type": "string",
                          "description": "Mã trạng thái giao dịch trong `data`.",
                          "example": "00"
                        },
                        "desc": {
                          "type": "string",
                          "description": "Mô tả trạng thái giao dịch trong `data`.",
                          "example": "Thành công"
                        },
                        "counterAccountBankId": {
                          "type": "string",
                          "nullable": true,
                          "description": "Mã ngân hàng tài khoản chuyển tiền.",
                          "example": "VCB"
                        },
                        "counterAccountBankName": {
                          "type": "string",
                          "nullable": true,
                          "description": "Tên ngân hàng tài khoản chuyển tiền.",
                          "example": "Vietcombank"
                        },
                        "counterAccountName": {
                          "type": "string",
                          "nullable": true,
                          "description": "Tên chủ tài khoản chuyển tiền.",
                          "example": "NGUYEN VAN A"
                        },
                        "counterAccountNumber": {
                          "type": "string",
                          "nullable": true,
                          "description": "Số tài khoản chuyển tiền.",
                          "example": "9876543210"
                        },
                        "virtualAccountName": {
                          "type": "string",
                          "nullable": true,
                          "description": "Tên tài khoản ảo.",
                          "example": "PC HARDWARE STORE"
                        },
                        "virtualAccountNumber": {
                          "type": "string",
                          "nullable": true,
                          "description": "Số tài khoản ảo.",
                          "example": "0123456789"
                        }
                      }
                    },
                    "signature": {
                      "type": "string",
                      "description": "Chữ ký dùng để xác minh webhook.",
                      "example": "2a8dfc64d1f5..."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Webhook được xác minh và đồng bộ trạng thái thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "order_id": {
                            "type": "integer",
                            "example": 1
                          },
                          "payment_id": {
                            "type": "integer",
                            "example": 12345
                          },
                          "payment_status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "success",
                              "failed"
                            ],
                            "example": "success"
                          },
                          "payosStatus": {
                            "type": "string",
                            "enum": [
                              "PENDING",
                              "PROCESSING",
                              "PAID",
                              "FAILED",
                              "CANCELLED",
                              "EXPIRED",
                              "UNDERPAID"
                            ],
                            "example": "PAID"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Webhook không hợp lệ hoặc không thể xử lý",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "orderCode PayOS không hợp lệ"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/payments/orders/{orderId}": {
        "post": {
          "summary": "Tạo payment link PayOS cho đơn hàng",
          "description": "Tạo link thanh toán cho đơn hàng của người dùng đang đăng nhập. Chỉ áp dụng cho đơn hàng dùng `bank_transfer` và chưa thanh toán.",
          "tags": [
            "Payment"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "orderId",
              "required": true,
              "description": "ID đơn hàng cần tạo payment link.",
              "schema": {
                "type": "integer",
                "minimum": 1,
                "example": 1
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Tạo payment link thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "payment_id": {
                            "type": "integer",
                            "description": "ID payment được tạo trong hệ thống.",
                            "example": 12345
                          },
                          "order_id": {
                            "type": "integer",
                            "description": "ID đơn hàng tương ứng.",
                            "example": 1
                          },
                          "paymentUrl": {
                            "type": "string",
                            "format": "uri",
                            "description": "Link thanh toán để chuyển người dùng sang PayOS.",
                            "example": "https://pay.payos.vn/web/123456789"
                          },
                          "paymentData": {
                            "type": "object",
                            "description": "Dữ liệu chi tiết do PayOS trả về.",
                            "properties": {
                              "bin": {
                                "type": "string",
                                "example": "970436"
                              },
                              "accountNumber": {
                                "type": "string",
                                "example": "1234567890"
                              },
                              "accountName": {
                                "type": "string",
                                "example": "PC HARDWARE STORE"
                              },
                              "amount": {
                                "type": "number",
                                "example": 500000
                              },
                              "description": {
                                "type": "string",
                                "example": "DH1-TT12345"
                              },
                              "orderCode": {
                                "type": "integer",
                                "example": 12345
                              },
                              "currency": {
                                "type": "string",
                                "example": "VND"
                              },
                              "paymentLinkId": {
                                "type": "string",
                                "example": "plink_123456"
                              },
                              "status": {
                                "type": "string",
                                "enum": [
                                  "PENDING",
                                  "PROCESSING",
                                  "PAID",
                                  "FAILED",
                                  "CANCELLED",
                                  "EXPIRED",
                                  "UNDERPAID"
                                ],
                                "example": "PENDING"
                              },
                              "checkoutUrl": {
                                "type": "string",
                                "format": "uri",
                                "example": "https://pay.payos.vn/web/123456789"
                              },
                              "qrCode": {
                                "type": "string",
                                "description": "Dữ liệu QR do PayOS trả về.",
                                "example": "000201010212..."
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Không thể tạo payment link",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "examples": {
                          "order_not_found": {
                            "value": "Đơn hàng không tồn tại"
                          },
                          "invalid_method": {
                            "value": "Đơn hàng không sử dụng phương thức thanh toán chuyển khoản"
                          },
                          "already_paid": {
                            "value": "Đơn hàng đã được thanh toán"
                          },
                          "cancelled_order": {
                            "value": "Đơn hàng đã bị hủy hoặc thất bại"
                          },
                          "gateway_error": {
                            "value": "Không thể tạo thanh toán PayOS"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Người dùng chưa đăng nhập hoặc token không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "examples": {
                          "missing_token": {
                            "value": "Token không được cung cấp"
                          },
                          "invalid_token": {
                            "value": "Token không hợp lệ hoặc đã hết hạn"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/products": {
        "get": {
          "summary": "Danh sách sản phẩm (có phân trang + lọc)",
          "tags": [
            "Products"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "integer",
                "example": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "example": 20
              }
            },
            {
              "in": "query",
              "name": "keyword",
              "schema": {
                "type": "string",
                "example": "laptop"
              }
            },
            {
              "in": "query",
              "name": "category_id",
              "schema": {
                "type": "integer",
                "example": 1
              }
            },
            {
              "in": "query",
              "name": "brand_id",
              "schema": {
                "type": "integer",
                "example": 2
              }
            },
            {
              "in": "query",
              "name": "price_min",
              "schema": {
                "type": "number",
                "example": 10000000
              }
            },
            {
              "in": "query",
              "name": "price_max",
              "schema": {
                "type": "number",
                "example": 30000000
              }
            },
            {
              "in": "query",
              "name": "sort",
              "schema": {
                "type": "string",
                "enum": [
                  "newest",
                  "oldest"
                ],
                "example": "newest"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách sản phẩm thành công"
            },
            "400": {
              "description": "Tham số không hợp lệ hoặc lỗi khi lấy dữ liệu"
            }
          }
        }
      },
      "/products/by-category/{category_id}": {
        "get": {
          "summary": "Sản phẩm theo danh mục (homepage block)",
          "tags": [
            "Products"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "category_id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "example": 8
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy sản phẩm theo danh mục thành công"
            },
            "400": {
              "description": "ID danh mục không hợp lệ hoặc lỗi khi lấy dữ liệu"
            }
          }
        }
      },
      "/products/{slug}": {
        "get": {
          "summary": "Chi tiết sản phẩm theo slug",
          "tags": [
            "Products"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "slug",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết sản phẩm thành công"
            },
            "400": {
              "description": "Sản phẩm không tồn tại hoặc slug không hợp lệ"
            }
          }
        }
      },
      "/return-requests": {
        "post": {
          "summary": "Tạo yêu cầu trả hàng / hoàn tiền",
          "description": "Tạo yêu cầu trả hàng cho đơn hàng của chính người dùng.\nAPI hiện chỉ chấp nhận tạo yêu cầu trả hàng cho đơn hàng đã ở trạng thái `delivered`.\nKhi gửi `multipart/form-data`, trường `items` có thể được gửi dưới dạng JSON string.\n",
          "tags": [
            "Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "order_id",
                    "reason",
                    "items"
                  ],
                  "properties": {
                    "order_id": {
                      "type": "integer",
                      "description": "ID đơn hàng cần tạo yêu cầu trả hàng",
                      "example": 123
                    },
                    "reason": {
                      "type": "string",
                      "description": "Lý do khách hàng yêu cầu trả hàng / hoàn tiền",
                      "example": "Sản phẩm bị lỗi khi nhận hàng"
                    },
                    "items": {
                      "description": "Danh sách order item cần trả hàng.\nVới `multipart/form-data`, nên gửi dưới dạng JSON string.\n",
                      "oneOf": [
                        {
                          "type": "string",
                          "example": "[{\"order_item_id\":1,\"quantity\":1,\"condition\":\"damaged\"}]"
                        },
                        {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "required": [
                              "order_item_id",
                              "quantity",
                              "condition"
                            ],
                            "properties": {
                              "order_item_id": {
                                "type": "integer",
                                "description": "ID của dòng sản phẩm trong đơn hàng",
                                "example": 1
                              },
                              "quantity": {
                                "type": "integer",
                                "description": "Số lượng cần trả",
                                "example": 1
                              },
                              "condition": {
                                "type": "string",
                                "description": "Tình trạng sản phẩm trả về",
                                "enum": [
                                  "good",
                                  "damaged",
                                  "wrong_item"
                                ],
                                "example": "damaged"
                              }
                            }
                          }
                        }
                      ]
                    },
                    "images": {
                      "type": "array",
                      "description": "Danh sách ảnh minh chứng, tối đa 10 ảnh",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    }
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "order_id",
                    "reason",
                    "items"
                  ],
                  "properties": {
                    "order_id": {
                      "type": "integer",
                      "example": 123
                    },
                    "reason": {
                      "type": "string",
                      "example": "Sản phẩm bị lỗi khi nhận hàng"
                    },
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": [
                          "order_item_id",
                          "quantity",
                          "condition"
                        ],
                        "properties": {
                          "order_item_id": {
                            "type": "integer",
                            "example": 1
                          },
                          "quantity": {
                            "type": "integer",
                            "example": 1
                          },
                          "condition": {
                            "type": "string",
                            "enum": [
                              "good",
                              "damaged",
                              "wrong_item"
                            ],
                            "example": "damaged"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tạo yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "pending"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "example": 25990000
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2026-04-21T08:30:00.000Z"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Tạo yêu cầu trả hàng thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dữ liệu không hợp lệ hoặc không đủ điều kiện trả hàng",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Chỉ có thể tạo yêu cầu trả hàng cho đơn hàng đã giao"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền truy cập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "get": {
          "summary": "Danh sách yêu cầu trả hàng của tôi",
          "description": "Trả về danh sách yêu cầu trả hàng của customer hiện tại.\nMỗi yêu cầu bao gồm thông tin chung và danh sách `return_items` đã join sang product, variant và ảnh variant.\n",
          "tags": [
            "Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "integer",
                              "example": 10
                            },
                            "reason": {
                              "type": "string",
                              "example": "Sản phẩm bị lỗi khi nhận hàng"
                            },
                            "status": {
                              "type": "string",
                              "enum": [
                                "pending",
                                "approved",
                                "rejected",
                                "received",
                                "completed"
                              ],
                              "example": "pending"
                            },
                            "admin_note": {
                              "type": "string",
                              "nullable": true,
                              "example": null
                            },
                            "refund_amount": {
                              "type": "number",
                              "format": "decimal",
                              "example": 25990000
                            },
                            "created_at": {
                              "type": "string",
                              "format": "date-time",
                              "example": "2026-04-21T08:30:00.000Z"
                            },
                            "return_items": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "id": {
                                    "type": "integer",
                                    "example": 100
                                  },
                                  "name": {
                                    "type": "string",
                                    "example": "RTX 4070 SUPER"
                                  },
                                  "slug": {
                                    "type": "string",
                                    "example": "rtx-4070-super"
                                  },
                                  "variant": {
                                    "type": "object",
                                    "properties": {
                                      "id": {
                                        "type": "integer",
                                        "example": 5
                                      },
                                      "version": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "12GB GDDR6X"
                                      },
                                      "color": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "Black"
                                      },
                                      "color_hex": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "#111111"
                                      },
                                      "image_url": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                      }
                                    }
                                  },
                                  "quantity": {
                                    "type": "integer",
                                    "example": 1
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền truy cập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/return-requests/{id}": {
        "get": {
          "summary": "Chi tiết yêu cầu trả hàng",
          "description": "Trả về chi tiết một yêu cầu trả hàng của customer hiện tại.\nResponse bao gồm thông tin request, danh sách `return_items`, danh sách ảnh minh chứng và địa chỉ nhận hàng của đơn gốc.\n",
          "tags": [
            "Return Requests"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy chi tiết yêu cầu trả hàng thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 10
                          },
                          "reason": {
                            "type": "string",
                            "example": "Sản phẩm bị lỗi khi nhận hàng"
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "pending",
                              "approved",
                              "rejected",
                              "received",
                              "completed"
                            ],
                            "example": "pending"
                          },
                          "admin_note": {
                            "type": "string",
                            "nullable": true,
                            "example": "Đang chờ kiểm tra"
                          },
                          "refund_amount": {
                            "type": "number",
                            "format": "decimal",
                            "example": 25990000
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2026-04-21T08:30:00.000Z"
                          },
                          "return_items": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "id": {
                                  "type": "integer",
                                  "example": 100
                                },
                                "product_id": {
                                  "type": "integer",
                                  "example": 20
                                },
                                "name": {
                                  "type": "string",
                                  "example": "RTX 4070 SUPER"
                                },
                                "slug": {
                                  "type": "string",
                                  "example": "rtx-4070-super"
                                },
                                "variant": {
                                  "type": "object",
                                  "properties": {
                                    "id": {
                                      "type": "integer",
                                      "example": 5
                                    },
                                    "version": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "12GB GDDR6X"
                                    },
                                    "color": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "Black"
                                    },
                                    "color_hex": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "#111111"
                                    },
                                    "image_url": {
                                      "type": "string",
                                      "nullable": true,
                                      "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                    }
                                  }
                                },
                                "quantity": {
                                  "type": "integer",
                                  "example": 1
                                },
                                "condition": {
                                  "type": "string",
                                  "enum": [
                                    "good",
                                    "damaged",
                                    "wrong_item"
                                  ],
                                  "example": "damaged"
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "decimal",
                                  "example": 25990000
                                }
                              }
                            }
                          },
                          "images": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "id": {
                                  "type": "integer",
                                  "example": 1
                                },
                                "image_url": {
                                  "type": "string",
                                  "example": "https://pc-hardware-bucket.s3.ap-southeast-1.amazonaws.com/return-requests/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256"
                                }
                              }
                            }
                          },
                          "address": {
                            "type": "object",
                            "properties": {
                              "id": {
                                "type": "integer",
                                "example": 12
                              },
                              "recipient": {
                                "type": "string",
                                "example": "Nguyen Van A"
                              },
                              "phone_number": {
                                "type": "string",
                                "example": "0901234567"
                              },
                              "province": {
                                "type": "string",
                                "example": "Ho Chi Minh"
                              },
                              "district": {
                                "type": "string",
                                "example": "District 1"
                              },
                              "ward": {
                                "type": "string",
                                "example": "Ben Nghe"
                              },
                              "street": {
                                "type": "string",
                                "example": "123 Le Loi"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "ID không hợp lệ hoặc yêu cầu không tồn tại",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Yêu cầu trả hàng không tồn tại"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Chưa đăng nhập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Không xác định được người dùng"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              "description": "Không có quyền truy cập",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Bạn không có quyền truy cập"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/users/me": {
        "get": {
          "summary": "Lấy thông tin tài khoản hiện tại",
          "description": "Lấy thông tin profile của người dùng đang đăng nhập. **Yêu cầu Bearer Token**",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy thông tin thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 1
                          },
                          "full_name": {
                            "type": "string",
                            "example": "Nguyen Van A"
                          },
                          "email": {
                            "type": "string",
                            "example": "user@example.com"
                          },
                          "phone_number": {
                            "type": "string",
                            "nullable": true,
                            "example": "0123456789"
                          },
                          "avatar_url": {
                            "type": "string",
                            "nullable": true,
                            "example": "https://example.com/avatar.jpg"
                          },
                          "setting": {
                            "type": "object",
                            "nullable": true,
                            "example": {}
                          },
                          "role": {
                            "type": "string",
                            "enum": [
                              "customer",
                              "admin"
                            ],
                            "example": "customer"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi server"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không được cung cấp"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "put": {
          "summary": "Cập nhật thông tin cá nhân",
          "description": "Cập nhật thông tin profile của người dùng (fullname, phone_number, setting). **Yêu cầu Bearer Token**",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "full_name": {
                      "type": "string",
                      "description": "Họ và tên",
                      "example": "Nguyen Van B"
                    },
                    "phone_number": {
                      "type": "string",
                      "description": "Số điện thoại",
                      "example": "0987654321"
                    },
                    "setting": {
                      "type": "object",
                      "description": "Cài đặt người dùng",
                      "example": {
                        "theme": "dark",
                        "notifications": true
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật thông tin thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "example": 1
                          },
                          "full_name": {
                            "type": "string",
                            "example": "Nguyen Van B"
                          },
                          "email": {
                            "type": "string",
                            "example": "user@example.com"
                          },
                          "phone_number": {
                            "type": "string",
                            "nullable": true,
                            "example": "0987654321"
                          },
                          "avatar_url": {
                            "type": "string",
                            "nullable": true,
                            "example": "https://example.com/avatar.jpg"
                          },
                          "setting": {
                            "type": "object",
                            "nullable": true,
                            "example": {
                              "theme": "dark",
                              "notifications": true
                            }
                          },
                          "role": {
                            "type": "string",
                            "enum": [
                              "customer",
                              "admin"
                            ],
                            "example": "customer"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Cập nhật thông tin cá nhân thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi server hoặc validation"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/users/me/avatar": {
        "patch": {
          "summary": "Cập nhật avatar người dùng",
          "description": "Upload ảnh avatar mới để cập nhật; nếu không gửi file avatar thì hệ thống sẽ xóa avatar hiện tại. **Yêu cầu Bearer Token**",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": false,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "avatar": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật avatar thành công"
            },
            "400": {
              "description": "Upload thất bại"
            },
            "401": {
              "description": "Token không hợp lệ hoặc đã hết hạn"
            }
          }
        }
      },
      "/users/me/password": {
        "put": {
          "summary": "Đổi mật khẩu",
          "description": "Đổi mật khẩu của người dùng đang đăng nhập. **Yêu cầu Bearer Token**",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "old_password",
                    "new_password"
                  ],
                  "properties": {
                    "old_password": {
                      "type": "string",
                      "description": "Mật khẩu hiện tại",
                      "example": "password123"
                    },
                    "new_password": {
                      "type": "string",
                      "description": "Mật khẩu mới",
                      "example": "newPassword456"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Đổi mật khẩu thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "message": {
                        "type": "string",
                        "example": "Đổi mật khẩu thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi validation hoặc mật khẩu cũ không đúng",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "error": {
                        "type": "string",
                        "example": "Mật khẩu hiện tại không đúng"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "example": "Token không hợp lệ hoặc đã hết hạn"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/users/me/addresses": {
        "get": {
          "summary": "Lấy danh sách địa chỉ",
          "description": "Lấy tất cả địa chỉ của người dùng. **Yêu cầu Bearer Token**",
          "tags": [
            "User Addresses"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Lấy danh sách thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "integer",
                              "example": 1
                            },
                            "recipient": {
                              "type": "string",
                              "example": "Nguyen Van A"
                            },
                            "phone_number": {
                              "type": "string",
                              "example": "0123456789"
                            },
                            "province": {
                              "type": "string",
                              "example": "Hà Nội"
                            },
                            "district": {
                              "type": "string",
                              "example": "Hoàn Kiếm"
                            },
                            "ward": {
                              "type": "string",
                              "example": "Hàng Trống"
                            },
                            "street": {
                              "type": "string",
                              "example": "123 Đường A"
                            },
                            "province_id": {
                              "type": "integer",
                              "example": 1
                            },
                            "district_id": {
                              "type": "integer",
                              "example": 1454
                            },
                            "ward_code": {
                              "type": "string",
                              "example": "21211"
                            },
                            "is_default": {
                              "type": "boolean",
                              "example": true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ"
            }
          }
        },
        "post": {
          "summary": "Thêm địa chỉ mới",
          "description": "Tạo một địa chỉ mới cho người dùng. `is_default` không nhận từ request; address đầu tiên sẽ tự động là mặc định, các address sau mặc định là `false`. **Yêu cầu Bearer Token**",
          "tags": [
            "User Addresses"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "recipient",
                    "phone_number",
                    "province",
                    "district",
                    "ward",
                    "street",
                    "province_id",
                    "district_id",
                    "ward_code"
                  ],
                  "properties": {
                    "recipient": {
                      "type": "string",
                      "description": "Tên người nhận",
                      "example": "Nguyen Van A"
                    },
                    "phone_number": {
                      "type": "string",
                      "description": "Số điện thoại người nhận",
                      "example": "0123456789"
                    },
                    "province": {
                      "type": "string",
                      "description": "Tỉnh / Thành phố",
                      "example": "Hà Nội"
                    },
                    "district": {
                      "type": "string",
                      "description": "Quận / Huyện",
                      "example": "Hoàn Kiếm"
                    },
                    "ward": {
                      "type": "string",
                      "description": "Phường / Xã",
                      "example": "Hàng Trống"
                    },
                    "street": {
                      "type": "string",
                      "description": "Số nhà, tên đường",
                      "example": "123 Đường A"
                    },
                    "province_id": {
                      "type": "integer",
                      "description": "ID tỉnh / thành phố theo hệ thống vận chuyển",
                      "example": 1
                    },
                    "district_id": {
                      "type": "integer",
                      "description": "ID quận / huyện theo hệ thống vận chuyển",
                      "example": 1454
                    },
                    "ward_code": {
                      "type": "string",
                      "description": "Mã phường / xã theo hệ thống vận chuyển",
                      "example": "21211"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Thêm địa chỉ thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer"
                          },
                          "recipient": {
                            "type": "string"
                          },
                          "phone_number": {
                            "type": "string"
                          },
                          "province": {
                            "type": "string"
                          },
                          "district": {
                            "type": "string"
                          },
                          "ward": {
                            "type": "string"
                          },
                          "street": {
                            "type": "string"
                          },
                          "province_id": {
                            "type": "integer"
                          },
                          "district_id": {
                            "type": "integer"
                          },
                          "ward_code": {
                            "type": "string"
                          },
                          "is_default": {
                            "type": "boolean"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Thêm địa chỉ thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi validation"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ"
            }
          }
        }
      },
      "/users/me/addresses/{id}": {
        "put": {
          "summary": "Cập nhật địa chỉ",
          "description": "Cập nhật thông tin địa chỉ. **Yêu cầu Bearer Token**",
          "tags": [
            "User Addresses"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              },
              "description": "ID địa chỉ"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "recipient",
                    "phone_number",
                    "province",
                    "district",
                    "ward",
                    "street",
                    "province_id",
                    "district_id",
                    "ward_code"
                  ],
                  "properties": {
                    "recipient": {
                      "type": "string"
                    },
                    "phone_number": {
                      "type": "string"
                    },
                    "province": {
                      "type": "string"
                    },
                    "district": {
                      "type": "string"
                    },
                    "ward": {
                      "type": "string"
                    },
                    "street": {
                      "type": "string"
                    },
                    "province_id": {
                      "type": "integer"
                    },
                    "district_id": {
                      "type": "integer"
                    },
                    "ward_code": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Cập nhật địa chỉ thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer"
                          },
                          "recipient": {
                            "type": "string"
                          },
                          "phone_number": {
                            "type": "string"
                          },
                          "province": {
                            "type": "string"
                          },
                          "district": {
                            "type": "string"
                          },
                          "ward": {
                            "type": "string"
                          },
                          "street": {
                            "type": "string"
                          },
                          "province_id": {
                            "type": "integer"
                          },
                          "district_id": {
                            "type": "integer"
                          },
                          "ward_code": {
                            "type": "string"
                          },
                          "is_default": {
                            "type": "boolean"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Cập nhật địa chỉ thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi validation hoặc địa chỉ không tồn tại"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ"
            }
          }
        },
        "delete": {
          "summary": "Xóa địa chỉ",
          "description": "Xóa một địa chỉ của người dùng. **Yêu cầu Bearer Token**",
          "tags": [
            "User Addresses"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              },
              "description": "ID địa chỉ"
            }
          ],
          "responses": {
            "200": {
              "description": "Xóa địa chỉ thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "message": {
                        "type": "string",
                        "example": "Xóa địa chỉ thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi validation hoặc địa chỉ không tồn tại"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ"
            }
          }
        }
      },
      "/users/me/addresses/{id}/default": {
        "patch": {
          "summary": "Đặt làm địa chỉ mặc định",
          "description": "Đặt một địa chỉ làm địa chỉ mặc định (các địa chỉ khác sẽ tự động không phải mặc định). **Yêu cầu Bearer Token**",
          "tags": [
            "User Addresses"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer"
              },
              "description": "ID địa chỉ"
            }
          ],
          "responses": {
            "200": {
              "description": "Đặt làm địa chỉ mặc định thành công",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer"
                          },
                          "recipient": {
                            "type": "string"
                          },
                          "phone_number": {
                            "type": "string"
                          },
                          "province": {
                            "type": "string"
                          },
                          "district": {
                            "type": "string"
                          },
                          "ward": {
                            "type": "string"
                          },
                          "street": {
                            "type": "string"
                          },
                          "province_id": {
                            "type": "integer"
                          },
                          "district_id": {
                            "type": "integer"
                          },
                          "ward_code": {
                            "type": "string"
                          },
                          "is_default": {
                            "type": "boolean"
                          }
                        }
                      },
                      "message": {
                        "type": "string",
                        "example": "Đặt làm địa chỉ mặc định thành công"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi validation hoặc địa chỉ không tồn tại"
            },
            "401": {
              "description": "Token không được cung cấp hoặc không hợp lệ"
            }
          }
        }
      }
    },
    "tags": [
      {
        "name": "Auth",
        "description": "Authentication APIs"
      },
      {
        "name": "Payment",
        "description": "Payment and PayOS transaction APIs"
      }
    ]
  },
  "customOptions": {
    "withCredentials": true
  }
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
