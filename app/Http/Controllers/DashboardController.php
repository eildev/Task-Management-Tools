<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskGroup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $sevenDaysAgo = Carbon::now()->subDays(7);
            $taskGroups = [
                "totalTaskGroup" => [
                    'total' => TaskGroup::count(),
                    'lastSevenDays' => TaskGroup::where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'projects' => [
                    'total' => TaskGroup::where('type', 'project')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'project')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'modules' => [
                    'total' => TaskGroup::where('type', 'module')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'module')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'subModules' => [
                    'total' => TaskGroup::where('type', 'submodule')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'submodule')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'features' => [
                    'total' => TaskGroup::where('type', 'feature')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'feature')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
            ];

            $tasks = [
                'totalTask' => [
                    'total' => Task::count(),
                    'lastSevenDays' => Task::where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
                'completedTask' => [
                    'total' => Task::where('status', 'completed')->count(),
                    'lastSevenDays' => Task::where('status', 'completed')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'inprogressTask' => [
                    'total' => Task::where('status', 'inprogress')->count(),
                    'lastSevenDays' => Task::where('status', 'inprogress')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'approvedTask' => [
                    'total' => Task::where('status', 'approved')->count(),
                    'lastSevenDays' => Task::where('status', 'approved')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'pendingTask' => [
                    'total' => Task::where('status', 'pending')->count(),
                    'lastSevenDays' => Task::where('status', 'pending')
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
                'unassignTask' => [
                    'total' => Task::where('assign_to', null)->count(),
                    'lastSevenDays' => Task::where('assign_to', null)
                        ->where('created_at', '>=', $sevenDaysAgo)
                        ->count(),
                ],
            ];

            $teams = User::with(['tasks' => function ($query) {
                $query->select('id', 'name', 'assign_to', 'status');
            }])
                ->select('id', 'name', 'email')
                ->get()
                ->map(function ($user) {
                    $totalTasks = $user->tasks->count();
                    $completedTasks = $user->tasks->where('status', 'completed')->count();
                    $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'taskCount' => $totalTasks,
                        'progress' => $progress,
                    ];
                });

            $data = [
                'taskGroups' => $taskGroups,
                'tasks' => $tasks,
                'teams' => $teams,
            ];
            return Inertia::render('Home', $data);
        } catch (\Exception $e) {
            Log::error('Error rendering dashboard: ' . $e->getMessage());

            // Render the Error component without withStatus
            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the dashboard. Please try again later.',
            ]);
        }
    }
}
