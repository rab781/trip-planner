<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    //Get /api/categories
    public function index()
    {
        $Categories = Category::all();
        return response()->json(
            [
                'data' => $Categories,
                'message' => 'Categories retrieved successfully',
                'status' => 200,
            ]
        );

        if (!$Categories) {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'No Categories found',
                    'status' => 404,
                ],
                404
            );
        }
    }

    // Get /api/categories/{id}
    public function show($id)
    {
        $Category = Category::find($id);

        if ($Category) {
            return response()->json(
                [
                    'data' => $Category,
                    'message' => 'Category retrieved successfully',
                    'status' => 200,
                ]
            );
        } else {
            return response()->json(
                [
                    'data' => null,
                    'message' => 'Category not found',
                    'status' => 404,
                ],
                404
            );
        }
    }
}
