import React, { useMemo, useState } from "react";
import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy";
import { CheckCircle2, Filter } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";

const CompletePage = () => {

    const {tasks, refreshTasks} = useOutletContext();
    const {sortBy, setSortBy} = useState('newest')

    const sortCompletedTasks = useMemo(() => {
        return tasks
        .filter(task=> [true,1,'yes'].includes(
            typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
        ))
        .sort((a, b) => {
            switch(sortBy) {
                case 'newest' : 
                    return new Date(b.createAt) - new Date(a.createAt)
                case 'oldest' : 
                    return new Date(a.createAt) - new Date(b.createAt)
                case 'priority' : {
                    const order = {high : 3, medium : 2, low : 1}
                    return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()]
                }
                default:
                return 0
            }
        })
    }, [tasks, sortBy])
    return (
       <div className={CT_CLASSES.page}>
        {/*Header */}
        <div className={CT_CLASSES.header}>
            <div className={CT_CLASSES.titleWrapper}>
                <h1 className={CT_CLASSES.title}>
                    <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
                    <span className="truncate">Completed Tasks</span>
                </h1>
                <p className={CT_CLASSES.subtitle}>
                    {sortCompletedTasks.length} task {' '}{sortCompletedTasks.length !== 1 && 's'}
                    marked as completed
                </p>
            </div>
                {/*SORT */} 
                <div className={CT_CLASSES.sortContainer}>
                    <div className={CT_CLASSES.sortBox}>
                        <div className={CT_CLASSES.filterLabel}>
                            <Filter className="w-4 h-4 text-purple-500" />
                            <span className="text-xs md:text-sm"> Sort by:</span>
                        </div>
                        {/*Mobile DROPDOWN*/}
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={CT_CLASSES.select}>
                            {SORT_OPTIONS.map(opt => (
                                <option key ={opt.id} value={opt.id}>
                                    {opt.label} {opt.id === 'newest' ? 'First' : ''}
                                </option>
                            ))}
                        </select>
                        <div className={CT_CLASSES.btnGroup}>
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => setSortBy(opt.id)} className={[
                                    CT_CLASSES.btnBase, sortBy === opt.id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive
                                ].join(" ")}>
                                    {opt.icon}{opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={CT_CLASSES.list}>
                {sortCompletedTasks.length === 0 ? (
                    <div className={CT_CLASSES.emptyState}>
                        <div className={CT_CLASSES.emptyIconWrapper}>
                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                        </div>
                        <h3 className={CT_CLASSES.emptyTitle}>
                            No completed tasks yet!
                        </h3>
                        <p className={CT_CLASSES.emptyText}>
                            Complete some tasks and they'll appear here
                        </p>
                    </div>
                ) : (
                    sortCompletedTasks.map(task => (
                        <TaskItem key = {task._id || task.id}
                        task = {task}
                        onRefresh={refreshTasks}
                        showCompleteCheckBox={false}
                        className='opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base' />
                    ))
                )}
            </div>
       </div>
    );
}
export default CompletePage;