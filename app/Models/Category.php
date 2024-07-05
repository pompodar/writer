<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'parent_id'];

    private $parents = [];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function findParents()
    {
        $parents = collect([]);

        if($this->parent) 
        { 
            $parent = $this->parent;

            while(!is_null($parent)) 
            {
                $parents->push($parent);
                $parent = $parent->parent;
            }

            return $parents;
        } else {
            return $this->name;
        }

    }

    public function findChildren()
    {
        return $this->children()->with('findChildren');
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }
}

