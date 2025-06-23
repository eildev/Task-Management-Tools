<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskGroup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $sevenDaysAgo = Carbon::now()->subDays(7);
            $user = Auth::user();
            $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';



            // Task Groups (same for all roles)
            $taskGroups = [
                "totalTaskGroup" => [
                    'total' => TaskGroup::count(),
                    'lastSevenDays' => TaskGroup::where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
                'projects' => [
                    'total' => TaskGroup::where('type', 'project')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'project')
                        ->where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
                'modules' => [
                    'total' => TaskGroup::where('type', 'module')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'module')
                        ->where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
                'subModules' => [
                    'total' => TaskGroup::where('type', 'submodule')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'submodule')
                        ->where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
                'features' => [
                    'total' => TaskGroup::where('type', 'feature')->count(),
                    'lastSevenDays' => TaskGroup::where('type', 'feature')
                        ->where('created_at', '>=', $sevenDaysAgo)->count(),
                ],
            ];

            // Tasks (different based on role)
            if ($isAdmin) {
                $allTask = Task::get();
                // Admin sees all task statistics
                $tasks = [
                    'totalTask' => [
                        'total' => Task::count(),
                        'lastSevenDays' => Task::where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'completedTask' => [
                        'total' => Task::where('status', 'completed')->count(),
                        'lastSevenDays' => Task::where('status', 'completed')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'inprogressTask' => [
                        'total' => Task::where('status', 'inprogress')->count(),
                        'lastSevenDays' => Task::where('status', 'inprogress')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'approvedTask' => [
                        'total' => Task::where('status', 'approved')->count(),
                        'lastSevenDays' => Task::where('status', 'approved')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'pendingTask' => [
                        'total' => Task::where('status', 'pending')->count(),
                        'lastSevenDays' => Task::where('status', 'pending')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'issuesTask' => [
                        'total' => Task::where('status', 'issues')->count(),
                        'lastSevenDays' => Task::where('status', 'issues')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'cancelledTask' => [
                        'total' => Task::where('status', 'cancelled')->count(),
                        'lastSevenDays' => Task::where('status', 'cancelled')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'holdTask' => [
                        'total' => Task::where('status', 'hold')->count(),
                        'lastSevenDays' => Task::where('status', 'hold')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'rejectedTask' => [
                        'total' => Task::where('status', 'rejected')->count(),
                        'lastSevenDays' => Task::where('status', 'rejected')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'unassignTask' => [
                        'total' => Task::where('assign_to', null)->count(),
                        'lastSevenDays' => Task::where('assign_to', null)
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                ];
            } else {
                $allTask = Task::where('assign_to', $user->id)->get();
                // User sees only their assigned task statistics
                $tasks = [
                    'totalTask' => [
                        'total' => Task::where('assign_to', $user->id)->count(),
                        'lastSevenDays' => Task::where('assign_to', $user->id)
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'completedTask' => [
                        'total' => Task::where('assign_to', $user->id)
                            ->where('status', 'completed')->count(),
                        'lastSevenDays' => Task::where('assign_to', $user->id)
                            ->where('status', 'completed')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'inprogressTask' => [
                        'total' => Task::where('assign_to', $user->id)
                            ->where('status', 'inprogress')->count(),
                        'lastSevenDays' => Task::where('assign_to', $user->id)
                            ->where('status', 'inprogress')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'pendingTask' => [
                        'total' => Task::where('assign_to', $user->id)
                            ->where('status', 'pending')->count(),
                        'lastSevenDays' => Task::where('assign_to', $user->id)
                            ->where('status', 'pending')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'issuesTask' => [
                        'total' => Task::where('status', 'issues')->count(),
                        'lastSevenDays' => Task::where('status', 'issues')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],
                    'cancelledTask' => [
                        'total' => Task::where('assign_to', $user->id)
                            ->where('status', 'pending')->count(),
                        'lastSevenDays' => Task::where('assign_to', $user->id)
                            ->where('status', 'pending')
                            ->where('created_at', '>=', $sevenDaysAgo)->count(),
                    ],

                ];
            }

            // Teams (only for admin)
            $teams = $isAdmin ? User::with(['tasks' => function ($query) {
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
                }) : [];

            // My Tasks (same for all roles)
            $myTasks = Task::where('assign_to', Auth::id())
                ->select('id', 'name', 'deadline', 'status')
                ->get()
                ->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'name' => $task->name,
                        'deadline' => $task->deadline ? Carbon::parse($task->deadline)->format('d M Y') : null,
                        'status' => $task->status,
                    ];
                });

            $data = [
                'taskGroups' => $taskGroups,
                'tasks' => $tasks,
                'teams' => $teams,
                'myTasks' => $myTasks,
                'allTask' => $allTask,
                'userRole' => $user->role, // Send user role to frontend
            ];

            return Inertia::render('Home', $data);
        } catch (\Exception $e) {
            Log::error('Error rendering dashboard: ' . $e->getMessage());

            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the dashboard. Please try again later.',
            ]);
        }
    }
}
