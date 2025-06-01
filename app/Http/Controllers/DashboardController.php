<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $data = [
                'title' => 'Dashboard',
            ];
            return Inertia::render('Home', $data);
        } catch (\Exception $e) {
            Log::error('Error rendering dashboard: ' . $e->getMessage());

            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the dashboard. Please try again later.',
            ])->withStatus(500);
        }
    }
}