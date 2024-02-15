<?php
namespace App\Helper\V1;

class KeyConverter{

    protected $from;
    protected $origData;

    public function fromCamelCase($data){
        $this->origData = $data;
        $this->from = "CamelCase";
        return $this;
    }

    public function fromSnakeCase($data){
        $this->origData = $data;
        $this->from = "SnakeCase";
        return $this;
    }

    public function fromPascalCase($data){
        $this->origData = $data;
        $this->from = "SnakeCase";
        return $this;
    }

    public function toCamelCase($from = null, $origData = null){
        $this->from = $from ?? $this->from;
        $this->origData = $origData ?? $this->origData;

        switch($this->from){
            case 'CamelCase':
                return $this->origData;
            break;
            case 'SnakeCase':
                $data = explode("_", $this->origData);
                $data = array_map(function($val){
                    return ucfirst($val);
                }, $data);
                $data = implode("", $data);
                return lcfirst($data);
            break;
            case 'PascalCase':
                return ucfirst($this->origData);
            break;
            default:
                return $this->origData;
            break;
        }
    }

    public function toSnakeCase($from = null, $origData = null){
        $this->from = $from ?? $this->from;
        $this->origData = $origData ?? $this->origData;

        switch($this->from){
            case 'CamelCase':
                $pattern = "/([A-Z])/";
                $replace = "_\\1";
                $data = preg_replace($pattern, $replace, $this->origData);
                return strtolower($data);
            break;
            case 'SnakeCase':
                return $this->origData;
            break;
            case 'PascalCase':
                $pattern = "/([A-Z])/";
                $replace = "_\\1";
                $data = lcfirst($this->origData);
                $data = preg_replace($pattern, $replace, $data);
                return $data;
            default:
                return $this->origData;
            break;
        }
    }

    public function toPascalCase($from = null, $origData = null){
        $this->from = $from ?? $this->from;
        $this->origData = $origData ?? $this->origData;

        switch($this->from){
            case 'CamelCase':
                return ucfirst($this->origData);
            break;
            case 'SnakeCase':
                $data = explode("_", $this->origData);
                $data = array_map(function($val){
                    return ucfirst($val);
                }, $data);
                return implode("", $data);
            break;
            case 'PascalCase':
                return $this->origData;
            default:
                return $this->origData;
            break;
        }
    }

}
